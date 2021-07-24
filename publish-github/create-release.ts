/* eslint-disable @typescript-eslint/naming-convention */
import { getInput, info } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { pathExists, readFile } from 'fs-extra'
import { prerelease } from 'semver'

type CreateRelease = {
  octokit: ReturnType<typeof getOctokit>,
  version: string,
}

const createRelease = async ( { octokit, version }: CreateRelease ) => {
  const { owner, repo } = context.repo

  // Get release body, if exists
  const bodyPath = getInput( 'changelog_path' )
  const body = await pathExists( bodyPath ) ? await readFile( bodyPath, 'utf8' ) : ''

  // Create GitHub release using latest tag
  info( `Creating GitHub release for ${version}` )
  const { data: {
    id,
    upload_url,
    html_url,
    assets_url,
  } } = await octokit.repos.createRelease( {
    name: version,
    owner,
    repo,
    body,
    tag_name: version,
    prerelease: !!prerelease( version ),
  } )

  return { id, upload_url, html_url, assets_url }
}

export default createRelease
