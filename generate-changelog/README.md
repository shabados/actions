# Generate Changelog Action

Generates and commits a `CHANGELOG.md`, based on the conventional commit standard.

## Inputs

### amend_commit

If set, amends the previous commit instead. Useful if the previous commit is a version bump commit.

## Example usage

```yaml
uses: shabados/actions/generate-changelog@release/v1
with:
  asset_paths: |
    **/*.tar.gz
    **/*.exe
```
