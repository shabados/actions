import { context, getOctokit } from '@actions/github'

type Notify = {
  octokit: ReturnType<typeof getOctokit>,
  version: string,
  releaseLink: string,
  issueNumber: string,
}

const notify = async ( { issueNumber, octokit, releaseLink, version }: Notify ) => {
  const { issue: { owner, repo } } = context

  await octokit.issues.createComment( {
    body: `Released in [${version}](${releaseLink}) 🎉`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    issue_number: issueNumber,
    owner,
    repo,
  } )
}

export default notify
