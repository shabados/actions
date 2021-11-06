import { chdir, cwd } from 'process'
import { exec } from 'child_process'
import { promisify } from 'util'

import { getInput, setFailed, info, debug, setOutput, getBooleanInput } from '@actions/core'
import { inc, minor, patch, prerelease, ReleaseType } from 'semver'
import SimpleGit from 'simple-git'

import getConventionalBump from './get-conventional-bump'

const asyncExec = promisify( exec )

const increment = (
  version: string,
  releaseType: ReleaseType,
  isNextPrerelease: boolean,
  prereleaseId: string,
) => {
  const nextInc = ( version: string, releaseType: string ) => inc( version, releaseType as ReleaseType, prereleaseId ) ?? ''
  const removeNext = ( version: string ) => nextInc( version, 'patch' )

  // Previous version is a prerelease or not
  const isCurrentlyPrerelease = !!prerelease( version )

  // Latest => Next, use prebump
  if ( !isCurrentlyPrerelease && isNextPrerelease ) return nextInc( version, `pre${releaseType}` )

  // Next => Latest, do appropriate increment and then strip prerelease tag
  if ( isCurrentlyPrerelease && !isNextPrerelease ) {
    // Never need to increment the patch
    return removeNext( releaseType === 'patch'
      ? version
      : nextInc( version, `pre${releaseType}` ) )
  }

  // Latest => Latest, just bump normally
  if ( !isCurrentlyPrerelease && !isNextPrerelease ) return nextInc( version, releaseType )

  // Next => Next
  // if patch, do prerelease
  if ( releaseType === 'patch' ) return nextInc( version, 'prerelease' )

  // if minor AND patch digit is 0, do prerelease, else preminor
  if ( releaseType === 'minor' ) return nextInc( version, !patch( version ) ? 'prerelease' : 'preminor' )

  // If major AND minor AND patch digit is 0, do prelease else premajor
  if ( releaseType === 'major' ) return nextInc( version, !patch( version ) && !minor( version ) ? 'prerelease' : 'premajor' )

  return nextInc( version, releaseType )
}

const run = async () => {
  // Navigate to correct directory
  const path = getInput( 'path' )
  debug( `Changing dir to ${path}, from ${cwd()}` )
  chdir( path )
  debug( `Path is now ${cwd()}` )

  // Name of prerelease id
  const prereleaseId = getInput( 'prerelease_branch' )
  const isPrerelease = getBooleanInput( 'prerelease' )

  // Get bump based on commit history since last release
  const { releaseType = '', reason = '' } = await getConventionalBump()
  info( `${reason} ${isPrerelease ? `and is a ${prereleaseId} prerelease` : ''}` )

  // Get current version from git tag. In case of a tiebreaker, sort by semver.
  const [ current ] = ( await SimpleGit().tag( [ '--sort=-v:refname', '--sort=-creatordate' ] ) ).split( '\n' )

  // Get new version based on next release information
  const version = increment( current, releaseType as ReleaseType, isPrerelease, prereleaseId )

  const hasChanged = version !== current

  if ( hasChanged ) {
    // Run npm version [version] with custom commit message
    info( `Bumping ${current} to ${version}` )
    await asyncExec( `npm version ${version} -m "build: bump to v${version}"` )
  }

  setOutput( 'previous', current )
  setOutput( 'next', version )
  setOutput( 'has_changed', hasChanged )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
