# Builds and Publish Docker Image Action

Builds and publishes a Docker Image to DockerHub and GitHub packages.

## Inputs

### `github_actor`

**Required** GitHub actor corresponding to the github_token.

### `github_token`

**Required** GitHub token to authenticate with. Must have push + release permissions.

### `dockerhub_username`

**Requred** DockerHub username to authenticate with.

### `dockerhub_password`

**Requred** DockerHub password or token to authenticate with.

### `dockerhub_namespace`

**Requred** DockerHub namespace to publish images github_token.

### `docker_context`

The Docker build context location.

### `docker_build_args`

**Requred** Any Docker build arguments, as a newline-separated list.


```yaml
uses: shabados/actions/publish-docker@release/v1
with:
  github_actor: ${{ secrets.GITHUB_ACTOR }}
  github_token: ${{ secrets.GITHUB_TOKEN }}
  dockerhub_username: ${{ secrets.DOCKERHUB_USERNAME }}
  dockerhub_password: ${{ secrets.DOCKERHUB_PASSWORD }}
  dockerhub_namespace: shabados
  docker_build_args: |
    NODE_ENV=production
```
