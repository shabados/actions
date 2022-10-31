import { readFile, writeFile } from 'fs/promises'

export const readJSON = ( path: string ) => readFile( path, 'utf-8' ).then( JSON.parse )

export const writeJSON = ( path: string, data: any ) => writeFile(
  path,
  JSON.stringify( data, null, 2 )
)
