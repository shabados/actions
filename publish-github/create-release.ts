/* eslint-disable @typescript-eslint/naming-convention */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import { getInput, info } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import conventionalChangelog from 'conventional-changelog'
import angularChangelog from 'conventional-changelog-angular'
import { prerelease } from 'semver'

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
  const body = existsSync( bodyPath )
    ? await readFile( bodyPath, 'utf8' )
    : await generateChangelog()

  const tag = `v${version}`

  // Create GitHub release using latest tag
  info( `Creating GitHub release for ${version}` )
  const { data: {
    id,
    upload_url,
    html_url,
    assets_url,
  } } = await octokit.rest.repos.createRelease( {
    name: tag,
    tag_name: tag,
    owner,
    repo,
    body,
    prerelease: !!prerelease( version ),
  } )

  return { id, upload_url, html_url, assets_url }
}

export default createRelease
