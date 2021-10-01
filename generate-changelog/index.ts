
import { createWriteStream } from 'fs'

import angularChangelog from 'conventional-changelog-angular'
import conventionalChangelog from 'conventional-changelog'
import { info, setFailed } from '@actions/core'
import { context } from '@actions/github'
import simpleGit from 'simple-git'

const CHANGELOG_PATH = 'CHANGELOG.md'

const generateChangelog = async () => {
  const config = await angularChangelog

  return new Promise( ( resolve, reject ) => {
    const writeStream = createWriteStream( CHANGELOG_PATH )

    conventionalChangelog( { releaseCount: 0, outputUnreleased: true, config } )
      .pipe( writeStream )
      .on( 'error', reject )
      .on( 'close', resolve )
  } )
}

const run = async () => {
  info( `Generating ${CHANGELOG_PATH}` )
  await generateChangelog()

  info( `Committing ${CHANGELOG_PATH}` )
  const git = simpleGit()

  const { latest = '' } = await git.tags()

  await git.add( CHANGELOG_PATH )
  await git.commit( `docs: update changelog with v${latest} notes` )
}

if ( require.main === module || context.job ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
