# Shabad OS Actions

Shabad OS cross-repository actions.

## Usage

Actions are all stored in subfolders.

```yaml
# example-workflow.yml

name: Continuous Integration

on: [push]

jobs:
  bump-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: shabados/actions/bump-version@release
```

### Actions

#### bump-version

Bumps the version of a repository according to the [project management release rules](https://github.com/shabados/.github/wiki/Project-Management#41-release-process).

Achieves this by bumping package.json, and creating a commit, and git tag.

##### Inputs

###### `path`

**Required** The path inside the repository containing the package.json to update. Default `"./"`.

###### `next`

**Required** If value supplied, indicate the bump will be for a next release. Default `""`.

##### Example usage

```yaml
uses: shabados/actions/bump-version@release
with:
  next: 'true'
```

## Todo

Encapsulate the following:

### Test Process

all repo specific or should we at least call lint test:e2e test:integration test:unit seperately?

### Build Process

- [x] Version bump
- [x] Build [repo-specific]
- Push
- Release [same action as push?]

#### Release Targets

- GH release branch via Force push
- npm + github npm registry
- dockerhub + github docker regsitry
- GH releases - mandatory
