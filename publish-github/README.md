# Publish GitHub Release Action

Create a GitHub release, including commit sync, changelog inclusion, and glob-based asset uploading.

- Pushes any commits and tags back to the `main` branch
- Creates a GitHub release using latest git tag
- If changelog present, publish it as release notes in the release
- Upload any assets matching the globs supplied

## Inputs

### `main_branch`

**Requred** The name of the main branch to push commits back to. Default `"main"`.

### `body_path`

**Required** The path to the file which will populate the contents of the release notes. Default `"CHANGELOG.md"`.

### `asset_paths`

A newline seperated string representing a list of globs. Files which match will be uploaded to the release.

## Outputs

### `id`

The GitHub release identifier.

### `upload_url`

The URL through which additional assets can be uploaded to the release.

### `html_url`

The URL to the GitHub release.

### `assets_url`

The URL to the GitHub release assets.

## Example usage

```yaml
uses: shabados/actions/publish-github@release/v1
with:
  asset_paths: |
    **/*.tar.gz
    **/*.exe
```
