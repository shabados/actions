
import { getInput, setFailed, info, setOutput } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import simpleGit from 'simple-git'

import createRelease from './create-release'
import notify from './notify'
import uploadAssets from './upload-assets'

const git = simpleGit()

const run = async () => {
  // Push to main branch
  const branch = getInput( 'main_branch' )
  info( `Pushing to ${branch}` )
  await git.push( 'origin', branch, { '--follow-tags': null } )

  // Get octokit instance
  const token = getInput( 'github_token' ) || process.env.GITHUB_TOKEN!
  const octokit = getOctokit( token )

  // Get latest version through tag
  const version = ( await ( git.raw( 'describe', '--abbrev=0' ) ) ).trim()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { id, upload_url, html_url, assets_url } = await createRelease( { octokit, version } )
  setOutput( 'id', id )
  setOutput( 'upload_url', upload_url )
  setOutput( 'html_url', html_url )
  setOutput( 'assets_url', assets_url )

  info( 'Uploading assets' )
  await uploadAssets( { octokit, id } )

  // Leave release comment on pull request
  if ( context.eventName === 'pull_request' ) await notify( { octokit, releaseLink: html_url, version } )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
