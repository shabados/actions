import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'

import { parse } from 'yaml'

import { resetEnv, setEnv } from './env'

type Input = {
  description: string,
  required: boolean,
  default?: string,
}

type ActionMetadata = {
  inputs: Record<string, Input>,
}

const actionDir = dirname( require.main?.filename ?? '' )
const action = parse( readFileSync( resolve( actionDir, 'action.yml' ), 'utf-8' ) ) as ActionMetadata

// Get action defaults
const defaults = Object
  .entries( action.inputs )
  .reduce( ( defaults, [ name, { default: value } ] ) => ( {
    ...defaults,
    [ name ]: value,
  } ), {} )

/**
 * Sets the inputs for the action.
 * Merged with default action inputs.
 */
export const setWith = ( inputs: Record<string, string> = {} ) => {
  resetEnv()

  // GitHub actions take input as `param` => `INPUT_PARAM` through the environment
  const actionInputs = Object
    .entries( { ...defaults, ...inputs } )
    .reduce( ( inputs, [ name, value ] ) => ( {
      ...inputs,
      // https://github.com/actions/toolkit/blob/master/docs/github-package.md#mocking-inputs
      [ `INPUT_${name.toUpperCase()}` ]: value,
    } ), {} )

  setEnv( actionInputs )
}
