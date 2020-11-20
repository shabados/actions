const intialEnv = { ...process.env }

export const resetEnv = () => {
  process.env = { ...intialEnv }
}

export const setEnv = ( env: Record<string, string> ) => {
  process.env = {
    ...process.env,
    ...env,
  }
}
