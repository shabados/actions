<img src="https://raw.githubusercontent.com/shabados/presenter/dev/resources/icon.png" width="128" alt="Shabad OS">

# @shabados/actions

Shabad OS cross-repository GitHub actions, designed to facilitate our [release process guidelines](https://github.com/shabados/.github/wiki/Project-Management).

[![Release][release-image]][release-url]
[![Next Release][next-image]][next-url]

- [Actions](#actions)
    - [Actions](#actions-1)
  - [Usage](#usage)
  - [Todo](#todo)
    - [Test Process](#test-process)
    - [Build Process](#build-process)
      - [Release Targets](#release-targets)

### Actions

- [Setup Git Identity](setup-git-identity/): sets up the Git user name and email address.
- [Semantic Version Bump](bump-version/): figures out and bumps version based on commit history, supporting a sensible prerelease scheme.
- [Generate Changelog](generate-changelog/): generates and commits the latest `CHANGELOG.md` based on conventional commits.
- [Integrate Commits](integrate-commits/): integrates commits made by CI into the main branch by pushing and building them to an integration branch and merging when the checks go green.
- [Publish Branch](publish-branch/): releases the current working directory as a release branch.
- [Publish Docker](publish-docker/): Builds and publishes the supplied context to DockerHub and GitHub packages.
- [Publish npm](publish-npm/): Publishes the current working directory to npm and GitHub packages.
- [Publish Github](publish-github/): pushes any committed changes back to GitHub, creates a release, and uploads any supplied assets to the release.

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

[release-image]: https://img.shields.io/github/workflow/status/shabados/actions/Release/main.svg?label=release
[release-url]: https://github.com/shabados/actions/actions?query=workflow%3A%22Release%22+branch%3Amain
[next-image]: https://img.shields.io/github/workflow/status/shabados/actions/Next%20Release/main.svg?label=next%20release
[next-url]: https://github.com/shabados/actions/actions?query=workflow%3A%22Next+Release%22+branch%3Amain
