import { context, getOctokit } from '@actions/github'

type Notify = {
  octokit: ReturnType<typeof getOctokit>,
  version: string,
  releaseLink: string,
}

const notify = async ( { octokit, releaseLink, version }: Notify ) => {
  const { issue: { number, owner, repo } } = context

  await octokit.issues.createComment( {
    body: `Released as [${version}](${releaseLink}) 🎉`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    issue_number: number,
    owner,
    repo,
  } )
}

export default notify
