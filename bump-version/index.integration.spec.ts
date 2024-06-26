import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { chdir } from 'node:process'

import SimpleGit, { Options } from 'simple-git'

import { setWith } from '../test/utils'
import { readJSON, writeJSON } from '../utils/fs'
import run from '.'

const TMP_PATH = join( __dirname, 'tmp', '/' )

enum CommitType {
  feat = 'feat',
  fix = 'fix',
  breaking = 'BREAKING CHANGE',
}

const commitMessages = {
  [ CommitType.feat ]: 'feat: add a new feature',
  [ CommitType.fix ]: 'fix: fix a bug',
  [ CommitType.breaking ]: 'feat: a new feature\n\nBREAKING CHANGE: you must remove x',
}

/**
 * Runs each test case.
 * Creates a fresh repo and applies the commits.
 */
const runCase = ( {
  prereleaseId = '',
  hasInitialTag = true,
} = {} ) => async (
  from: string,
  to: string,
  commits: CommitType[],
) => {
  // Create repo in temporary path
  const path = await mkdtemp( TMP_PATH )

  // Set up git and action with path
  const git = SimpleGit( path )
  setWith( { path, prerelease: !!prereleaseId, prerelease_id: prereleaseId } )

  // Initialise repository with package.json
  const packagePath = join( path, 'package.json' )
  await writeJSON( packagePath, { name: 'test', version: from } )

  await git
    .init()
    .add( packagePath )
    .commit( `build: release v${from}` )

  if ( hasInitialTag ) await git.addTag( `v${from}` )

  // Apply each commit
  const options: Options = { '--allow-empty': null }
  await commits.reduce(
    async ( promise, commit ) => {
      await promise
      await git.commit( commitMessages[ commit ], undefined, options )
    },
    Promise.resolve(),
  )

  // Run the action
  await run()

  // Check the bump
  const { version } = await readJSON( packagePath )
  expect( version ).toEqual( to )
}

type TestCase = [string, string, CommitType[]]

beforeAll( async () => {
  await mkdir( TMP_PATH, { recursive: true } )
} )

afterAll( async () => {
  chdir( __dirname )
  await rm( TMP_PATH, { force: true, recursive: true } )
} )

jest.setTimeout( 10 * 1000 )

describe( 'bump-version', () => {
  describe( 'from latest release -> latest release', () => {
    const cases: TestCase[] = [
      [ '1.0.0', '1.0.1', [ CommitType.fix ] ],
      [ '1.0.0', '1.0.1', [ CommitType.fix, CommitType.fix ] ],
      [ '1.0.0', '1.1.0', [ CommitType.feat ] ],
      [ '1.0.0', '1.1.0', [ CommitType.fix, CommitType.feat ] ],
      [ '1.0.0', '2.0.0', [ CommitType.breaking ] ],
      [ '1.0.0', '2.0.0', [ CommitType.fix, CommitType.breaking ] ],
    ]

    it.each( cases )( 'should bump %s to %s, given a %p in commit history', runCase() )
  } )

  describe( 'from next release -> latest release', () => {
    const cases: TestCase[] = [
      [ '1.0.0-next.2', '1.1.0', [ CommitType.feat ] ],
      [ '1.0.0-next.2', '2.0.0', [ CommitType.breaking ] ],
      [ '1.0.0-next.2', '1.0.0', [ CommitType.fix ] ],
      [ '1.0.0-next.2', '1.0.0', [] ],
      [ '1.0.1-next.2', '1.0.1', [] ],
      [ '1.1.0-next.2', '1.1.0', [] ],
    ]

    it.each( cases )( 'should bump %s to %s, given a %p in commit history', runCase() )
  } )

  describe( 'from latest release -> next release', () => {
    const cases: TestCase[] = [
      [ '1.0.0', '1.0.1-next.0', [ CommitType.fix ] ],
      [ '1.0.1', '1.0.2-next.0', [ CommitType.fix ] ],
      [ '1.1.1', '1.2.0-next.0', [ CommitType.feat ] ],
      [ '1.1.1', '2.0.0-next.0', [ CommitType.breaking ] ],
    ]

    it.each( cases )( 'should bump %s to %s, given a %p in commit history', runCase( { prereleaseId: 'next' } ) )

    it( 'should bump with any prerelease prefix, given a commit history', () => runCase( { prereleaseId: 'beta' } )( '1.0.0', '1.0.1-beta.0', [ CommitType.fix ] ) )
  } )

  describe( 'from next release -> next release', () => {
    const cases: TestCase[] = [
      [ '1.0.1-next.0', '1.0.1-next.1', [ CommitType.fix, CommitType.fix ] ],
      [ '1.0.1-next.1', '1.1.0-next.0', [ CommitType.feat ] ],
      [ '1.1.0-next.0', '1.1.0-next.1', [ CommitType.feat ] ],
      [ '1.1.0-next.0', '1.1.0-next.1', [ CommitType.fix ] ],
      [ '1.1.0-next.0', '2.0.0-next.0', [ CommitType.breaking ] ],
      [ '2.0.0-next.0', '2.0.0-next.1', [ CommitType.breaking ] ],
      [ '2.0.0-next.0', '2.0.0-next.1', [ CommitType.feat ] ],
      [ '2.0.0-next.0', '2.0.0-next.1', [ CommitType.fix ] ],
    ]

    it.each( cases )( 'should bump %s to %s, given a %p in commit history', runCase( { prereleaseId: 'next' } ) )
  } )

  describe( 'from no release -> next release', () => {
    type TestCase = [string, CommitType[], string?]

    const cases: TestCase[] = [
      [ '1.0.0', [ CommitType.breaking ] ],
      [ '1.0.0-next.0', [ CommitType.breaking ], 'next' ],
    ]

    it.each( cases )( 'should bump to %s, given a %p in commit history and no existing version git tag', ( to, commits, prereleaseId = '' ) => runCase( { prereleaseId, hasInitialTag: false } )( '0.0.1', to, commits ) )
  } )
} )
