import { promisify } from 'node:util'

import angularChangelog from 'conventional-changelog-angular'
import getBump, { Callback, Options } from 'conventional-recommended-bump'

type AsyncGetBump = ( options: Options ) => Promise<Callback.Recommendation>

const asyncGetBump = promisify( getBump ) as AsyncGetBump

export default async () => asyncGetBump( { config: angularChangelog } )
