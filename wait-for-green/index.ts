import { error, getInput, info, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async/dynamic'

const pollUntil = (
  condition: () => Promise<boolean>,
  interval: number,
) => new Promise<void>( ( resolve ) => {
  const timer = setIntervalAsync( async () => {
    if ( !await condition().catch( error ) ) return

    await clearIntervalAsync( timer )
    resolve()
  }, interval )
} )

const run = async () => {
  const interval = Number( getInput( 'interval' ) )
  const ref = getInput( 'ref' )

  // Get octokit instance
  const token = getInput( 'github_token' ) || process.env.github_token! || process.env.GITHUB_TOKEN!
  const octokit = getOctokit( token )

  const { repo } = context

  info( `Polling ${repo.owner}/${repo.repo}/${ref} every ${interval} seconds` )

  await pollUntil( async () => {
    const { data: { check_runs: runs } } = await octokit.rest.checks.listForRef( { ...repo, ref } )

    const result = runs.every( ( { name, conclusion, status } ) => {
      info( `Status of ${name}: ${status} -> ${conclusion ?? ''}` )

      return status === 'completed'
    } )

    if (
      result
      && runs.some( ( { conclusion } ) => [ 'failure', 'timed_out' ].includes( conclusion ?? '' ) )
    ) setFailed( 'Check(s) have failed' )

    return result
  }, interval * 1000 )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
