import { getInput } from '@actions/core'
import { major, minor, prerelease } from 'semver'

const getReleaseBranches = ( version: string ) => [
  'latest',
  `v${major( version )}`,
  `v${major( version )}.${minor( version )}`,
]

// Enumerate the release branches to push to
const getBranches = async () => {
  const prefix = getInput( 'release_branch_prefix' )

  // Get latest version through input
  const version = getInput( 'release_version' )

  const [ prereleaseName ] = prerelease( version ) ?? []

  // Use the supplied prerelease branch name, otherwise extract it from the version
  const prereleaseBranch = getInput( 'prerelease_branch' ) || prereleaseName

  const isRelease = !prereleaseName

  return [
    `v${version}`,
    // Always update the prerelease branch, if supplied
    prereleaseBranch,
    ...( isRelease ? getReleaseBranches( version ) : [] ),
  ]
    // Remove any falsy values
    .filter( ( x ) => x )
    // Add release prefix
    .map( ( suffix ) => `${prefix}/${suffix}` )
}

export default getBranches
