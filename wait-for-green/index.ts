import { getInput, info, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic'

const pollUntil = (
  condition: () => Promise<boolean>,
  interval: number,
) => new Promise<void>( ( resolve ) => {
  const timer = setIntervalAsync( async () => {
    if ( !await condition() ) return

    await clearIntervalAsync( timer )
    resolve()
  }, interval )
} )

const run = async () => {
  const interval = Number( getInput( 'interval' ) ) * 1000
  const ref = getInput( 'ref' )

  // Get octokit instance
  const token = getInput( 'github_token' ) || process.env.github_token! || process.env.GITHUB_TOKEN!
  const octokit = getOctokit( token )

  const { repo } = context

  info( `Polling ${repo.owner}/${repo.repo}/${ref} every ${interval} seconds` )

  await pollUntil( async () => {
    const { data: { state } } = await octokit.repos.getCombinedStatusForRef( { ...repo, ref } )

    info( `Current status: ${state}` )

    return state === 'success'
  }, interval )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
