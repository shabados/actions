declare module 'conventional-changelog-angular' {
  import conventionalChangelog from 'conventional-changelog'

  type ConventionalChangelogOptions = {
    writerOpts: Parameters<typeof conventionalChangelog>[4] & {
      transform: ( commit: any, context: any ) => any,
    },
  }

  const options: Promise<ConventionalChangelogOptions>

  export default options
}
