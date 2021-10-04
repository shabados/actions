import { getInput } from '@actions/core'
import { major, minor, prerelease } from 'semver'

// Enumerate the release branches to push to
const getBranches = async () => {
  const prefix = getInput( 'release_branch_prefix' )

  // Get latest version through input
  const version = getInput( 'release_version' )

  // Optionally get the name of the prerelease branch
  const prereleaseBranch = getInput( 'prerelease_branch' )

  const [ prereleaseName ] = prerelease( version ) || []

  return [
    version,
    ...( prereleaseName
      // Use the supplied prerelease branch name, otherwise extract it from the version
      ? [ prereleaseBranch ?? prereleaseName ]
      : [
        'latest',
        `v${major( version )}`,
        `v${major( version )}.${minor( version )}`,
        // If defined, update the prerelease branch
        ...( prereleaseBranch ? [ prereleaseBranch ] : [] ),
      ]
    ),
  ].map( ( suffix ) => `${prefix}/${suffix}` )
}

export default getBranches
