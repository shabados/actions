# Semantic Version Bump Action

Figures out the correct release type using the Angular [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) rules against commit history since last release.

Bumps the version of a repository according to the [project management release rules](https://github.com/shabados/.github/wiki/Project-Management#41-release-process) by bumping package.json, creating a commit, and tagging it with the bumped SemVer.

If `prerelease` is specified, the next version will be bumped to a prerelease version, with the supplied prerelease input as the id.

See the test cases to understand the bump rules, which follow SemVer, but bump from a non-prerelease to a prerelease in a manner that makes sense.

## Inputs

### `path`

**Required** The path inside the repository containing the target package.json to update. Default `"./"`.

### `prerelease_branch`

If prerelease bump is required, the name of the prerelease id. Default `next`.

### `prerelease`

If true, the version is bumped to the next prerelease, with the prerelease id set in `prerelease_branch`. Default `false`.

## Outputs

### `previous`

The previous semantic version.

### `next`

The next semantic version.

### `has_changed`

Whether the version has changed since the previous.

## Example usage

```yaml
uses: shabados/actions/bump-version@release
with:
  prerelease: true
  prerelease_branch: 'next'
```
