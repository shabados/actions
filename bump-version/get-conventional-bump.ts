import angularChangelog from 'conventional-changelog-angular'
import getBump from 'conventional-recommended-bump'

export default async () => getBump( {
  config: await angularChangelog(),
} )
