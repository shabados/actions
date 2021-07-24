
import { createWriteStream } from 'fs'

import angularChangelog from 'conventional-changelog-angular'
import conventionalChangelog from 'conventional-changelog'
import { getInput, info, setFailed } from '@actions/core'
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

  const shouldAmend = !!getInput( 'amend_commit' )

  await git.add( CHANGELOG_PATH )
  if ( shouldAmend ) await git.raw( 'commit', '--amend', '--no-edit' )
  else await git.commit( `docs: update ${CHANGELOG_PATH}` )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
