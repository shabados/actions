import { createWriteStream } from 'node:fs'

import { info, setFailed } from '@actions/core'
import conventionalChangelog from 'conventional-changelog'
import angularChangelog from 'conventional-changelog-angular'
import simpleGit from 'simple-git'

import { streamToPromise } from '../utils'

const CHANGELOG_PATH = 'CHANGELOG.md'

const generateChangelog = async () => {
  const writeStream = createWriteStream( CHANGELOG_PATH )

  const changelogStream = conventionalChangelog( {
    releaseCount: 0,
    outputUnreleased: true,
    config: await angularChangelog,
  } )

  return streamToPromise( changelogStream.pipe( writeStream ) )
}

const run = async () => {
  info( `Generating ${CHANGELOG_PATH}` )
  await generateChangelog()

  info( `Committing ${CHANGELOG_PATH}` )
  const git = simpleGit()

  await git.add( CHANGELOG_PATH )
  await git.commit( 'docs: update changelog' )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
