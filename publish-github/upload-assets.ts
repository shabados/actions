
import { basename } from 'path'

import { context, getOctokit } from '@actions/github'
import * as glob from '@actions/glob'
import { info } from '@actions/core'
import { readFile } from 'fs-extra'

import { getInputs } from '../utils'

type UploadAssets = {
  octokit: ReturnType<typeof getOctokit>,
  id: number,
}

const { owner, repo } = context.repo

const uploadAssets = async ( { octokit, id }: UploadAssets ) => {
  const assetPaths = getInputs( 'asset_paths' )
  const globber = await glob.create( assetPaths.join( '\n' ) )
  const files = await globber.glob()

  await Promise.all( files.map( async ( path ) => {
    info( `Uploading ${path}` )

    return octokit.repos.uploadReleaseAsset( {
      name: basename( path ),
      data: await readFile( path ),
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      release_id: id,
    } )
  } ) )
}

export default uploadAssets
