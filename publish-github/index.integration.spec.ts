import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chdir } from 'node:process'

import { getOctokit } from '@actions/github'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import simpleGit from 'simple-git'

import { setWith } from '../test/utils'

jest.mock( '@actions/github', () => ( {
  ...jest.requireActual( '@actions/github' ),
  getOctokit: ( token: string, config: Parameters<typeof getOctokit>[1] ) => ( jest
    .requireActual( '@actions/github' )
    .getOctokit as typeof getOctokit )( token, {
    ...config,
    request: {
      fetch: globalThis.fetch,
    },
  } ),
} ) )

type MockReleaseBody = {
  prerelease: boolean,
  tag_name: string,
  name: string,
  body: string | RegExp,
}

const server = setupServer(
  http.post( 'https://uploads.github.com/*', () => HttpResponse.text() ),
  http.post( 'https://api.github.com/repos/:owner/:repo/releases', () => HttpResponse.json<MockReleaseBody>( {
    body: '',
    name: 'v3.3.3',
    tag_name: 'v3.3.3',
    prerelease: false,
  } ) )
)

type MockCreateRelease = {
  body: string | RegExp,
  version: string,
  prerelease: boolean,

}

const mockCreateRelease = ( { body, prerelease, version }: MockCreateRelease ) => server.use( http.post( 'https://api.github.com/repos/:owner/:repo/releases', () => HttpResponse.json<MockReleaseBody>( {
  prerelease,
  tag_name: `v${version}`,
  name: `v${version}`,
  body,
} ) ) )

beforeAll( () => server.listen( { onUnhandledRequest: 'error' } ) )
afterEach( () => server.resetHandlers() )
afterAll( () => server.close() )

const run = () => import( '.' ).then( ( { default: run } ) => run() )

const TMP_PATH = join( __dirname, 'tmp' )

beforeAll( async () => {
  await mkdir( TMP_PATH, { recursive: true } )
} )

afterAll( async () => {
  chdir( __dirname )
  await rm( TMP_PATH, { force: true, recursive: true } )
} )

describe( 'publish-github', () => {
  describe( 'when creating a release', () => {
    it( 'should create a release with the supplied release version', async () => {
      const version = '1.3.0'
      setWith( { release_version: version } )
      mockCreateRelease( { body: /.*/, version, prerelease: false } )

      await run()
    } )
  } )

  describe( 'when uploading assets', () => {
    it( 'should upload all assets, given globs via asset_paths', async () => {
      setWith( {
        github_token: 'test',
        asset_paths: `
        test*
        **/*.png
        `,
      } )
      const mockFiles = [ 'test1.txt', 'test.txt', 'test3.text', 'asset1.png', 'ignore.txt' ]

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )
      await Promise.all( mockFiles.map( ( name ) => writeFile( name, '' ) ) )

      await run()
    } )

    it( 'should upload the body path, if supplied', async () => {
      const version = '1.1.0'
      setWith( { github_token: 'test', body_path: 'changelog.md', release_version: version } )

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )

      const changelogContent = 'test changelog \nnew change'
      await writeFile( 'changelog.md', changelogContent )

      mockCreateRelease( {
        body: changelogContent,
        version,
        prerelease: false,
      } )

      await run()
    } )

    it( 'should upload a generated changelog, if body_path is not supplied', async () => {
      const version = '1.1.0'
      setWith( { github_token: 'test', release_version: version } )

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )

      await simpleGit( path )
        .init()
        .commit( 'fix: test commit', undefined, { '--allow-empty': null } )

      mockCreateRelease( {
        body: /test commit/,
        version,
        prerelease: false,
      } )

      await run()
    } )
  } )
} )
