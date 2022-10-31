import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import { getMultilineInput, info } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import * as glob from '@actions/glob'

type UploadAssets = {
  octokit: ReturnType<typeof getOctokit>,
  id: number,
}

const { owner, repo } = context.repo

const uploadAssets = async ( { octokit, id }: UploadAssets ) => {
  const assetPaths = getMultilineInput( 'asset_paths' )
  const globber = await glob.create( assetPaths.join( '\n' ) )
  const files = await globber.glob()

  await Promise.all( files.map( async ( path ) => {
    info( `Uploading ${path}` )

    return octokit.rest.repos.uploadReleaseAsset( {
      name: basename( path ),
      // Until octokit type definitions are updated in @actions/github
      data: await readFile( path ) as any as string,
      owner,
      repo,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      release_id: id,
    } )
  } ) )
}

export default uploadAssets
