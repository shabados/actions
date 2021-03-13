import { execSync } from 'child_process'
import { readdirSync } from 'fs'

const actionDirectories = readdirSync( '.', { withFileTypes: true } )
  .filter( ( directory ) => directory.isDirectory() )
  .filter( ( directory ) => {
    const files = readdirSync( directory.name )

    return files.includes( 'action.yml' ) && files.includes( 'index.ts' )
  } )
  .map( ( directory ) => directory.name )

console.log( `Building ${actionDirectories.length} actions\n` )

actionDirectories.forEach( ( name ) => {
  console.log( `Building ${name}` )

  execSync( `ncc build ${name}/index.ts -o ${name}/dist` )
} )
