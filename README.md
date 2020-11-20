# Shabad OS Actions

Shabad OS cross-repository GitHub actions.

### Actions

- [Semantic Version Bump](bump-version/): figures out and bumps version based on commit history, supporting a sensible prerelease scheme.

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
