import { Stream } from 'stream'

export const streamToPromise = ( stream: Stream ) => new Promise(
  ( resolve, reject ) => stream.on( 'error', reject ).on( 'close', resolve ),
)
