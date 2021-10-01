import { join } from 'path'
import { chdir } from 'process'

import { mkdirp, writeFile } from 'fs-extra'
import nock from 'nock'
import { v4 } from 'uuid'

import { setWith } from '../test/utils'

const run = () => import( '.' ).then( ( { default: run } ) => run() )

type NockReleaseBody = { prerelease: boolean, tag_name: string, name: string, body: string }
const nockCreateRelease = ( body?: NockReleaseBody, response?: nock.Body ) => nock( 'https://api.github.com' )
  .post( `/repos/${process.env.GITHUB_REPOSITORY!}/releases`, body )
  .reply( 200, response )

const nockUploadAsset = ( releaseId: number, name: string ) => nock( 'https://uploads.github.com' )
  .post( `/repos/${process.env.GITHUB_REPOSITORY!}/releases/${releaseId}/assets?name=${name}&` )
  .reply( 200 )

const gitMock = {
  push: jest.fn(),
}

jest.mock( 'simple-git', () => () => gitMock )

const TMP_PATH = join( __dirname, 'tmp' )

describe( 'publish-github', () => {
  describe( 'when pushing', () => {
    it( 'should push the contents of the directory to the main branch', async () => {
      const testBranch = 'test'
      setWith( { main_branch: testBranch } )

      nockCreateRelease()

      await run()

      expect( gitMock.push ).toHaveBeenCalledWith( 'origin', testBranch, { '--follow-tags': null } )
    } )
  } )

  describe( 'when creating a release', () => {
    it( 'should create a release with the latest tag', async () => {
      const latestTag = 'v1.3.0'
      setWith( { release_version: latestTag, body_path: '' } )

      const createRelease = nockCreateRelease( { body: '', name: latestTag, tag_name: latestTag, prerelease: false } )

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

    it( 'should upload a changelog, if it exists', async () => {
      const latestTag = 'v1.1.0'
      setWith( { body_path: 'changelog.md', release_version: latestTag } )

      const path = join( TMP_PATH, v4() )
      await mkdirp( path )
      chdir( path )

      const changelogContent = 'test changelog \nnew change'
      await writeFile( 'changelog.md', changelogContent )

      const createRelease = nockCreateRelease( {
        body: changelogContent,
        name: latestTag,
        tag_name: latestTag,
        prerelease: false,
      } )

      await run()

      expect( createRelease.isDone() ).toBeTruthy()
    } )
  } )
} )
