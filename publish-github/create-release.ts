/* eslint-disable @typescript-eslint/naming-convention */
import { getInput, info } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { pathExists, readFile } from 'fs-extra'
import { prerelease } from 'semver'
import { SimpleGit } from 'simple-git'

type CreateRelease = {
  octokit: ReturnType<typeof getOctokit>,
  git: SimpleGit,
}

const createRelease = async ( { octokit, git }: CreateRelease ) => {
  const { owner, repo } = context.repo

  // Get release body, if exists
  const bodyPath = getInput( 'changelog_path' )
  const body = await pathExists( bodyPath ) ? await readFile( bodyPath, 'utf8' ) : ''

  // Get latest tag
  const latestTag = ( await ( git.raw( 'describe', '--abbrev=0' ) ) ).trim()

  // Create GitHub release using latest tag
  info( `Creating GitHub release for ${latestTag}` )
  const { data: {
    id,
    upload_url,
    html_url,
    assets_url,
  } } = await octokit.repos.createRelease( {
    name: latestTag,
    owner,
    repo,
    body,
    tag_name: latestTag,
    prerelease: !!prerelease( latestTag ),
  } )

  return { id, upload_url, html_url, assets_url }
}

export default createRelease
