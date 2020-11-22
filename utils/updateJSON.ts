import { readJSON, writeJSON } from 'fs-extra'

/**
 * Update JSON file with new values, with top-level key merging
 */
export const updateJSON = async ( path: string, object: Record<string, any> ) => {
  const json = await readJSON( path ) as Record<string, any>

  return writeJSON( path, { ...json, ...object }, { spaces: 2 } )
}
