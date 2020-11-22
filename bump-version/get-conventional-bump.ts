import { promisify } from 'util'

import getBump, { Callback, Options } from 'conventional-recommended-bump'

type AsyncGetBump = ( options: Options ) => Promise<Callback.Recommendation>

const asyncGetBump = promisify( getBump ) as AsyncGetBump

export default () => asyncGetBump( { preset: 'angular' } )
