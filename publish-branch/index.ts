import { setFailed, info, getInput } from '@actions/core'
import { appendFile } from 'fs-extra'
import simpleGit from 'simple-git'

import getBranches from './get-branches'

const run = async () => {
  const git = simpleGit()

  // Append to root gitignore
  const gitignore = getInput( 'gitignore' )
  info( 'Appending to .gitignore' )
  await appendFile( '.gitignore', `\n${gitignore}` )

  // Get branches to release to if no fixed branch is set
  const fixedBranch = getInput( 'fixed_branch' )
  const branches = fixedBranch ? [ fixedBranch ] : await getBranches( { git } )

  // Add files to temporary branch
  await git.branch( [ 'temporary-publish-branch-action-scratch' ] )
  await git.add( [ '-A' ] )
  await git.commit( `build: release branch ${branches[ 0 ]}` )

  // Push the contents of the temporary each branch
  await branches.reduce(
    async ( promise, branch ) => {
      await promise

      try {
        info( `Creating ${branch}` )
        await git.branch( [ branch ] )
      } catch ( error ) {
        info( `Updating ${branch}` )
        await git.checkout( [ branch ] )
      }

      await git.push( 'origin', branch )
    },
    Promise.resolve(),
  )

  // Checkout original directory
  await git.checkout( process.env.GITHUB_REF! )
}

if ( require.main === module ) {
  run().catch( ( error: Error ) => setFailed( `Action failed with error ${error.toString()}` ) )
}

export default run
