import { join, resolve } from 'path'
import { chdir } from 'process'

import { mkdirp, pathExists, writeJSON } from 'fs-extra'
import simpleGit from 'simple-git'
import { v4 } from 'uuid'

import { setWith } from '../test/utils'
import run from '.'

const TMP_PATH = join( __dirname, 'tmp' )

type CaseOptions = {
  fixedBranch?: string,
}

const runCase = (
  version: string,
  expectedBranch: string,
  { fixedBranch = '' }: CaseOptions = {},
) => async () => {
  setWith( { fixed_branch: fixedBranch, release_version: version, prerelease_branch: 'beta' } )

  // Create repo in temporary path
  const path = resolve( TMP_PATH, v4() )

  // "Local" repository
  const localPath = join( path, 'local' )
  await mkdirp( localPath )
  chdir( localPath )
  const localGit = simpleGit( localPath )

  // "Remote" repository, simulated on filesystem
  const remotePath = join( path, 'remote' )
  await mkdirp( remotePath )
  const remoteGit = simpleGit( remotePath )

  // Initialise repository with package.json
  await writeJSON( join( remotePath, 'package.json' ), { name: 'test', version: 'v' } )

  // Initialise remote repository
  await remoteGit
    .init()
    .add( '-A' )
    .commit( `build: release ${version}` )

  // Clone simulated remote repository into local repository
  await localGit.clone( remotePath, localPath )

  // Add dummy build artifact to local repository
  await writeJSON( join( localPath, 'output.json' ), { test: true } )

  // Run the action
  await run()

  // Release branch should exist on remote
  await remoteGit.checkout( expectedBranch )
  // Expect artifact to be present on pushed origin
  expect( await pathExists( join( remotePath, 'output.json' ) ) ).toBeTruthy()
}

jest.setTimeout( 1000 * 10 )

describe( 'publish-branch', () => {
  it( 'should publish to a release branch of the latest tag', runCase( '1.4.3', 'release/v1.4.3' ) )

  it( 'should publish to a release branch of the latest tag, given previous releases', async () => {
    await runCase( '1.4.3', 'release/v1.4.3' )()
    await runCase( '1.4.4', 'release/v1.4.4' )()
  } )

  it( 'should publish to a fixed branch, given an input with a fixed branch name', runCase( '1.4.3', 'gh-pages', { fixedBranch: 'gh-pages' } ) )

  describe( 'with prereleases', () => {
    it( 'should publish to the latest prerelease branch', runCase( '1.4.3-beta.4', 'release/beta' ) )
  } )

  describe( 'with releases', () => {
    it( 'should publish to the latest branch', runCase( '1.4.3', 'release/latest' ) )
    it( 'should publish to the prerelease branch', runCase( '1.4.3', 'release/beta' ) )
    it( 'should publish to the major branch of the latest tag', runCase( '1.4.3', 'release/v1' ) )
    it( 'should publish to the minor branch of the latest tag', runCase( '1.4.3', 'release/v1.4' ) )
  } )
} )
