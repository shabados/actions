# Wait for Green Action

Waits until the status checks for a given ref have passed. Useful for blocking pipelines until a build has completed.

## Inputs

### `github_token`

**Required** The GitHub token to authenticate with. Must have release permissions.

### `ref`

**Required** The ref to check the statuses of.

### `interval`

The interval in seconds to poll the statuses at. Default `30` seconds.
