# Integrate commits Action

Integrates commits back into the main branch by pushing commits to an integration branch, waiting for the commits to pass any status checks, and then merging into the main branch.

This allows for confidence when re-integrating commits made by CI or release processes back into the main branch.

## Inputs

### `main_branch`

**Required** The name of the main branch to push commits to.

### `integration_branch`

**Requred** The branch to push commits to and build before merging into the main branch.

```yaml
uses: shabados/actions/integrate-commits@release/v1
```
