declare module 'conventional-changelog-angular' {
  import conventionalChangelog from 'conventional-changelog'

  type ConventionalChangelogOptions = {
    writerOpts: Parameters<typeof conventionalChangelog>[4] & {
      transform: ( commit: any, context: any ) => any,
    },
  }

  type CreatePreset = () => Promise<ConventionalChangelogOptions>
  const createPreset: CreatePreset

  export default createPreset
}
