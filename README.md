# Shabad OS Actions

GitHub actions to facilitate Shabad OS [release process guidelines](https://docs.shabados.com/community/project-management).

[![Release](https://github.com/shabados/actions/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/shabados/actions/actions/workflows/release.yml)
[![Release Next](https://github.com/shabados/actions/actions/workflows/release-next.yml/badge.svg?branch=main)](https://github.com/shabados/actions/actions/workflows/release-next.yml)

## Actions

- [Setup Git Identity](setup-git-identity/): sets up the Git user name and email address.
- [Semantic Version Bump](bump-version/): figures out and bumps version based on commit history, supporting a sensible prerelease scheme.
- [Generate Changelog](generate-changelog/): generates and commits the latest `CHANGELOG.md` based on conventional commits.
- [Integrate Commits](integrate-commits/): integrates commits made by CI into the main branch by pushing and building them to an integration branch and merging when the checks go green.
- [Publish Branch](publish-branch/): releases the current working directory as a release branch.
- [Publish Docker](publish-docker/): Builds and publishes the supplied context to DockerHub and GitHub packages.
- [Publish npm](publish-npm/): Publishes the current working directory to npm and GitHub packages.
- [Publish Github](publish-github/): Creates a GitHub release, and uploads any supplied assets to the release.
- [Wait for Green](wait-for-green/): Waits until the status checks for a given ref have passed.

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
