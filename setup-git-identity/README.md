# Setup Git Identity Action

Sets up the global Git user name and email address.

## Inputs

### `user`

**Required** The git user to set.

### `email`

**Requred** The git email address to set

```yaml
uses: shabados/actions/setup-git-identity@release/v1
with:
  user: Release Bot
  email: release-bot@somewhere.com
```
