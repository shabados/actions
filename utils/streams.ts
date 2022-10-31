import { Stream } from 'node:stream'

export const streamToPromise = ( stream: Stream ) => new Promise(
  ( resolve, reject ) => stream.on( 'error', reject ).on( 'close', resolve ),
)

export const streamToString = ( stream: Stream ) => new Promise<string>( ( resolve, reject ) => {
  const chunks = [] as Uint8Array[]

  stream
    .on( 'data', ( chunk: Uint8Array ) => chunks.push( Buffer.from( chunk ) ) )
    .on( 'error', ( err ) => reject( err ) )
    .on( 'end', () => resolve( Buffer.concat( chunks ).toString( 'utf8' ) ) )
} )
