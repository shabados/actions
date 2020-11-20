import { chdir, cwd } from 'process'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { getInput, setFailed, info, debug } from '@actions/core'
import { inc, minor, patch, prerelease, ReleaseType } from 'semver'
import { readJSON } from 'fs-extra'

import getConventionalBump from './get-conventional-bump'

const asyncExec = promisify( exec )

type Package = {
  version: string,
}

const increment = ( version: string, releaseType: ReleaseType, prereleaseId: string ) => {
  const nextInc = ( version: string, releaseType: string ) => inc( version, releaseType as ReleaseType, prereleaseId ) ?? ''
  const removeNext = ( version: string ) => nextInc( version, 'patch' )

  // Whether the next release should be a prerelease
  const isNextPrelease = !!prereleaseId

  // Previous version is a prerelease or not
  const isCurrentlyPrerelease = !!prerelease( version )

  // Latest => Next, use prebump
  if ( !isCurrentlyPrerelease && isNextPrelease ) return nextInc( version, `pre${releaseType}` )

  // Next => Latest, do appropriate increment and then strip prerelease tag
  if ( isCurrentlyPrerelease && !isNextPrelease ) {
    // Never need to increment the patch
    return removeNext( releaseType === 'patch'
      ? version
      : nextInc( version, `pre${releaseType}` ) )
  }

  // Latest => Latest, just bump normally
  if ( !isCurrentlyPrerelease && !isNextPrelease ) return nextInc( version, releaseType )

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
  debug( `Changing dir to ${path}` )
  chdir( path )

  // Name of prerelease id, if it should be one
  const prereleaseId = getInput( 'prerelease' )

  // Get bump based on commit history since last release
  const { releaseType = '', reason = '' } = await getConventionalBump()
  info( `${reason} and is a prerelease` )

  // Get current version
  const { version: current } = await readJSON( join( cwd(), 'package.json' ) ) as Package

  // Get new version based on next release information
  const version = increment( current, releaseType as ReleaseType, prereleaseId )

  // Run npm version [version] with custom commit message
  info( `Bumping ${current} to ${version}` )
  await asyncExec( `npm version ${version} -m "build: release v${version}"` )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
