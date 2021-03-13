import { promisify } from 'util'

import getBump, { Callback, Options } from 'conventional-recommended-bump'
import angularChangelog from 'conventional-changelog-angular'

type AsyncGetBump = ( options: Options ) => Promise<Callback.Recommendation>

const asyncGetBump = promisify( getBump ) as AsyncGetBump

export default async () => asyncGetBump( { config: angularChangelog } )
