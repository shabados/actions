# Publish NPM package Action

Publishes an npm package to npm and GitHub packages. The repository should be in a state that is ready to push before running this action - ensure `.npmignore` is set up correctly and that build and dist steps have been completed.

## Inputs

### `github_token`

**Required** GitHub token to authenticate with. Must have push + release permissions.

### `npm_token`

**Requred** NPM token to authenticate with.

```yaml
uses: shabados/actions/publish-npm@release/v1
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  npm_token: ${{ secrets.NPM_TOKEN }}
```
