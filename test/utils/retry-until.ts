import { wait } from './wait'

export const retryUntil = ( fn: () => Promise<void> ) => fn()
  .catch( () => wait( 1000 ) )
  .then( fn )
