import { join } from 'path'
import { chdir } from 'process'

import { mkdirp, writeFile } from 'fs-extra'
import nock from 'nock'
import { v4 } from 'uuid'
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

const nockUploadAsset = ( releaseId: number, name: string ) => nock( 'https://uploads.github.com' )
  .post( `/repos/${process.env.GITHUB_REPOSITORY!}/releases/${releaseId}/assets?name=${name}&` )
  .reply( 200 )

const TMP_PATH = join( __dirname, 'tmp' )

describe( 'publish-github', () => {
  describe( 'when creating a release', () => {
    it( 'should create a release with the supplied release version', async () => {
      const releaseVersion = 'v1.3.0'
      setWith( { release_version: releaseVersion } )

      const createRelease = nockCreateRelease( { body: /.*/, name: releaseVersion, tag_name: releaseVersion, prerelease: false } )

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

      const path = join( TMP_PATH, v4() )
      await mkdirp( path )
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
      const releaseVersion = 'v1.1.0'
      setWith( { body_path: 'changelog.md', release_version: releaseVersion } )

      const path = join( TMP_PATH, v4() )
      await mkdirp( path )
      chdir( path )

      const changelogContent = 'test changelog \nnew change'
      await writeFile( 'changelog.md', changelogContent )

      const createRelease = nockCreateRelease( {
        body: changelogContent,
        name: releaseVersion,
        tag_name: releaseVersion,
        prerelease: false,
      } )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )

    it( 'should upload a generated changelog, if body_path is not supplied', async () => {
      const releaseVersion = 'v1.1.0'
      setWith( { release_version: releaseVersion } )

      const path = join( TMP_PATH, v4() )
      await mkdirp( path )
      chdir( path )

      await simpleGit( path )
        .init()
        .commit( 'fix: test commit', undefined, { '--allow-empty': null } )

      const createRelease = nockCreateRelease( {
        body: /test commit/,
        name: releaseVersion,
        tag_name: releaseVersion,
        prerelease: false,
      } )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )
  } )
} )
