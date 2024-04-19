declare module 'conventional-changelog-angular' {
  import conventionalChangelog from 'conventional-changelog'

  type ConventionalChangelogOptions = {
    writerOpts: Parameters<typeof conventionalChangelog>[4] & {
      transform: ( commit: unknown, context: unknown ) => unknown,
    },
  }

  type CreatePreset = () => Promise<ConventionalChangelogOptions>
  const createPreset: CreatePreset

  export default createPreset
}
