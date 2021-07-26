# Associated Commit PR Has Label 

For commits that have been pushed to a branch, this action will figure out if there was a PR associated with it, retrieve the labels, and determine which workflow to run based on the matched label.

Intended for use with pull requests of certain labels triggering releases once merged, but without using the `pull_request` event type, to avoid token issues.

## Inputs

### `github_token`

**Required** GitHub token to authenticate with. Must have push + release permissions.

### `label`

**Required** The label to check the presence of.

## Outputs

### `has_label`

Boolean for whether or not the associated pull request has the label.

## Example usage

```yaml
uses: shabados/actions/commit-pr-has-label@release/v1
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  workflow_labels: |
    release-next=Release: Next
    release-latest=Release: Latest 
```
