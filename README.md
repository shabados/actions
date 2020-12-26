<img src="https://raw.githubusercontent.com/shabados/presenter/dev/resources/icon.png" width="128" alt="Shabad OS">

# Actions

Shabad OS cross-repository GitHub actions.

[![Release][release-image]][release-url]
[![Next Release][next-image]][next-url]

- [Shabad OS Actions](#shabad-os-actions)
  - [Actions](#actions)
  - [Usage](#usage)
  - [Todo](#todo)
    - [Test Process](#test-process)
    - [Build Process](#build-process)
      - [Release Targets](#release-targets)

### Actions

- [Semantic Version Bump](bump-version/): figures out and bumps version based on commit history, supporting a sensible prerelease scheme.
- [Publish Branch](publish-branch/): releases the current working directory as a release branch, using the latest git tag.
- [Publish Github](publish-github/): pushes any committed changes back to GitHub, creates a release using the latest git tag, and uploads any supplied assets to the release.

## Usage

Actions are all stored in subfolders, and released through branches. You can pin down the version, if desired.

Version examples:

- `release/next` - prereleases
- `release/v2.0.0-next.2` - exactly 2.0.0-next.2
- `release/latest` - latest stable
- `release/v1` - all 1.x.x
- `release/v1.1` - all 1.1.x
- `release/v1.1.1` - exactly 1.1.1

An action can be referenced as per the example below:

```yaml
# example-workflow.yml

name: Continuous Integration

on: [push]

jobs:
  bump-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: shabados/actions/bump-version@release/v1
```

Unfortunately, the action

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

[release-image]: https://img.shields.io/github/workflow/status/shabados/actions/Continuous%20Integration/main.svg?label=release
[release-url]: https://github.com/shabados/actions/actions?query=workflow%3A%22Continuous+Integration%22+branch%3Amain
[next-image]: https://img.shields.io/github/workflow/status/shabados/actions/Continuous%20Integration/main.svg?label=next%20release
[next-url]: https://github.com/shabados/actions/actions?query=workflow%3A%22Continuous+Integration%22+branch%3Amain
