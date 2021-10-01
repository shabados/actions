# Generate Changelog Action

Generates and commits a `CHANGELOG.md`, based on the conventional commit standard.

## Example usage

```yaml
uses: shabados/actions/generate-changelog@release/v1
with:
  asset_paths: |
    **/*.tar.gz
    **/*.exe
```
