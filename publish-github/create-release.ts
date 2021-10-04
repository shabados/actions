/* eslint-disable @typescript-eslint/naming-convention */
import { getInput, info } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { pathExists, readFile } from 'fs-extra'
import { prerelease } from 'semver'
import conventionalChangelog from 'conventional-changelog'
import angularChangelog from 'conventional-changelog-angular'

import { streamToString, tail } from '../utils'

const generateChangelog = async () => streamToString(
  conventionalChangelog( { config: await angularChangelog } ),
).then( tail )

type CreateRelease = {
  octokit: ReturnType<typeof getOctokit>,
  version: string,
}

const createRelease = async ( { octokit, version }: CreateRelease ) => {
  const { owner, repo } = context.repo

  // Get release body, else generate changelog for latest release
  const bodyPath = getInput( 'body_path' )
  const body = await pathExists( bodyPath )
    ? await readFile( bodyPath, 'utf8' )
    : await generateChangelog()

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
