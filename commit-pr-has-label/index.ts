import { getInput, info, setFailed, setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'

const run = async () => {
  // Get octokit instance
  const token = getInput( 'github_token' ) ?? process.env.github_token ?? process.env.GITHUB_TOKEN
  const octokit = getOctokit( token )

  const { sha, repo: { owner, repo } } = context

  info( `Fetching pull request for commit ${sha}` )

  const { data: [ pull ] } = await octokit.repos.listPullRequestsAssociatedWithCommit( {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    commit_sha: sha,
    owner,
    repo,
  } )

  if ( !pull ) {
    info( 'No pull requests found' )
    setOutput( 'has_label', false )
    return
  }

  info( `Found ${pull.html_url}` )

  const { labels } = pull
  const label = getInput( 'label' ).toLowerCase()

  const hasLabel = labels.map( ( { name } ) => name.toLowerCase() ).includes( label )

  setOutput( 'has_label', hasLabel )
}

if ( require.main === module || context.job ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
