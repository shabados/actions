import { mkdtemp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chdir } from 'node:process'

import nock from 'nock'
import simpleGit from 'simple-git'

import { setWith } from '../test/utils'

const run = () => import( '.' ).then( ( { default: run } ) => run() )

type NockReleaseBody = {
  prerelease: boolean,
  tag_name: string,
  name: string,
  body: string | RegExp,
}

const nockCreateRelease = ( body?: NockReleaseBody, response?: nock.Body ) => nock( 'https://api.github.com' )
  .post( `/repos/${process.env.GITHUB_REPOSITORY!}/releases`, body )
  .reply( 200, response )

type GetReleaseBody = ( body: Omit<NockReleaseBody, 'name' | 'tag_name'> & { version: string } ) => NockReleaseBody
const getReleaseBody: GetReleaseBody = ( { version, ...body } ) => ( {
  ...body,
  tag_name: `v${version}`,
  name: `v${version}`,
} )

const nockUploadAsset = ( releaseId: number, name: string ) => nock( 'https://uploads.github.com' )
  .post( `/repos/${process.env.GITHUB_REPOSITORY!}/releases/${releaseId}/assets?name=${name}&` )
  .reply( 200 )

const TMP_PATH = join( __dirname, 'tmp' )

describe( 'publish-github', () => {
  describe( 'when creating a release', () => {
    it( 'should create a release with the supplied release version', async () => {
      const version = '1.3.0'
      setWith( { release_version: version } )

      const createRelease = nockCreateRelease( getReleaseBody( { body: /.*/, version, prerelease: false } ) )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )
  } )

  describe( 'when uploading assets', () => {
    it( 'should upload all assets, given globs via asset_paths', async () => {
      setWith( {
        asset_paths: `
        test*
        **/*.png
        `,
      } )
      const mockFiles = [ 'test1.txt', 'test.txt', 'test3.text', 'asset1.png', 'ignore.txt' ]

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )
      await Promise.all( mockFiles.map( ( name ) => writeFile( name, '' ) ) )

      const responseId = 1
      nockCreateRelease( undefined, { id: responseId } )
      const uploadAssets = mockFiles
        .slice( 0, 4 )
        .map( ( name ) => nockUploadAsset( responseId, name ) )

      await run()

      expect( uploadAssets.every( ( mock ) => mock.isDone() ) ).toBeTruthy()
    } )

    it( 'should upload the body path, if supplied', async () => {
      const version = '1.1.0'
      setWith( { body_path: 'changelog.md', release_version: version } )

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )

      const changelogContent = 'test changelog \nnew change'
      await writeFile( 'changelog.md', changelogContent )

      const createRelease = nockCreateRelease( getReleaseBody( {
        body: changelogContent,
        version,
        prerelease: false,
      } ) )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )

    it( 'should upload a generated changelog, if body_path is not supplied', async () => {
      const version = '1.1.0'
      setWith( { release_version: version } )

      const path = await mkdtemp( join( TMP_PATH, '/' ) )
      chdir( path )

      await simpleGit( path )
        .init()
        .commit( 'fix: test commit', undefined, { '--allow-empty': null } )

      const createRelease = nockCreateRelease( getReleaseBody( {
        body: /test commit/,
        version,
        prerelease: false,
      } ) )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )
  } )
} )
