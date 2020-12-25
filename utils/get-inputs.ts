import { getInput } from '@actions/core'

export const getInputs = ( name: string ) => getInput( name )
  .split( '\n' )
  .filter( ( x ) => x )
