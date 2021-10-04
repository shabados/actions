import { getInput } from '@actions/core'
import { major, minor, prerelease } from 'semver'

// Enumerate the release branches to push to
const getBranches = async () => {
  const prefix = getInput( 'release_branch_prefix' )

  // Get latest version through input
  const version = getInput( 'release_version' )

  const [ prereleaseName ] = prerelease( version ) || []

  return [
    version,
    ...( prereleaseName
      ? [ prereleaseName ]
      : [
        'latest',
        `v${major( version )}`,
        `v${major( version )}.${minor( version )}`,
        prereleaseName,
      ]
    ),
  ].map( ( suffix ) => `${prefix}/${suffix}` )
}

export default getBranches
