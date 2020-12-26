import { getInput } from '@actions/core'
import { major, minor, prerelease } from 'semver'
import { SimpleGit } from 'simple-git'

type GetBranches = {
  git: SimpleGit,
}

// Enumerate the release branches to push to
const getBranches = async ( { git }: GetBranches ) => {
  const prefix = getInput( 'release_branch_prefix' )
  // Get latest tag
  const { latest = '' } = await git.tags()

  const [ prereleaseName ] = prerelease( latest ) || []

  return [
    latest,
    ...( prereleaseName
      ? [ prereleaseName ]
      : [
        'latest',
        `v${major( latest )}`,
        `v${major( latest )}.${minor( latest )}`,
      ]
    ),
  ].map( ( suffix ) => `${prefix}/${suffix}` )
}

export default getBranches
