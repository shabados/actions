# Unreleased (2021-10-04)



# [1.5.0-next.0](https://github.com/shabados/actions/compare/v1.4.0...v1.5.0-next.0) (2021-10-04)


### Bug Fixes

* **publish-github:** correct typing for issue number in notify ([cb83a73](https://github.com/shabados/actions/commit/cb83a73437c9a77cfc98f9115e59dcce07b62ddb))
* **publish-github:** disable notify on merged PR ([5bab9b4](https://github.com/shabados/actions/commit/5bab9b4bda7f51aac4b770be83714516f83c3bdd))


### Features

* **integrate-commits:** add integrate-commits action ([c3d590a](https://github.com/shabados/actions/commit/c3d590a6fc6c4f215b25370e9dd10fe40d2dd161))
* **publish-branches:** update  prerelease branch if supplied ([e863233](https://github.com/shabados/actions/commit/e863233232c2b10ff0d7458564d64ed7fcf5592d))



# [1.4.0](https://github.com/shabados/actions/compare/1.3.0-next.5...v1.4.0) (2021-10-04)


### Features

* **publish-branch:** publish to next when latest is released ([24ddd46](https://github.com/shabados/actions/commit/24ddd463dd11d3f29f686c2507ec0a01839ea843))



# [1.3.0-next.5](https://github.com/shabados/actions/compare/v1.3.0-next.5...1.3.0-next.5) (2021-10-04)



# [1.3.0-next.5](https://github.com/shabados/actions/compare/v1.3.0-next.4...v1.3.0-next.5) (2021-10-04)


### Features

* **publish-github:** add support for changelog in release body ([0809325](https://github.com/shabados/actions/commit/0809325a2071ec7f075033f378a1a0c10f66d853))



# [1.3.0-next.4](https://github.com/shabados/actions/compare/v1.3.0-next.3...v1.3.0-next.4) (2021-10-03)


### Bug Fixes

* remove context.job as entrypoint for execution ([395cf74](https://github.com/shabados/actions/commit/395cf74064f3873246b77b817f82fc71715d8581))


### Features

* **bump-version:** more accurately reflect bump commit message ([1749c25](https://github.com/shabados/actions/commit/1749c25c0605056e54c3f04bed48b9821f7c8073))
* **generate-changelog:** remove amend commit functionality ([22753b6](https://github.com/shabados/actions/commit/22753b6415f8b25dd716c890d3d04a7e450983fc))
* **publish-branch:** read release version from input instead of git tag ([02e9fd8](https://github.com/shabados/actions/commit/02e9fd86d59754630a8bbb2d5c3249d40e079cf6))
* **publish-github:** get release version through input ([8f252e8](https://github.com/shabados/actions/commit/8f252e8e8302bc7f27a0f4f61b4f13c9c50aff7d))



# [1.3.0-next.3](https://github.com/shabados/actions/compare/v1.3.0-next.0...v1.3.0-next.3) (2021-07-26)


### Bug Fixes

* add context.job as a entrypoint trigger ([52e6205](https://github.com/shabados/actions/commit/52e62055ac141369a1c13888c83883cc21e7820b))
* **bump-version:** add missing context import ([d13410d](https://github.com/shabados/actions/commit/d13410d18bd7769d0d03cc3128cee9a1e5308ed7))
* **bump-version:** load package.json from path input ([a74cbdb](https://github.com/shabados/actions/commit/a74cbdbf67384104300962ca5559119a0191e2ab))
* **publish-github:** only acquire version via annotated tags, not lightweight ([f6c4443](https://github.com/shabados/actions/commit/f6c444352ac95b3fc539e1f0a70832a5abe0c8f1))
* revert action runner back to node12 ([#31](https://github.com/shabados/actions/issues/31)) ([b5dd693](https://github.com/shabados/actions/commit/b5dd693a35b21bed663809c8ea7b72c6922ee7b2))


### Features

* **commit-pr-has-label:** add action to check if associated PR has label ([75b4888](https://github.com/shabados/actions/commit/75b4888cc989e3e738889097d8d004a477fc58ab))



# [1.3.0-next.0](https://github.com/shabados/actions/compare/v1.2.0...v1.3.0-next.0) (2021-07-24)


### Bug Fixes

* **bump-version:** log correct release type in information message ([7512628](https://github.com/shabados/actions/commit/7512628db7c6954437ab2972880f0447351e0ac5))
* **generate-changelog:** use shouldAmend correctly ([e4734d1](https://github.com/shabados/actions/commit/e4734d194e8cdc51a5fc65b7adc6b82506fdd850))
* only run push CI workflow on main branch ([5403f13](https://github.com/shabados/actions/commit/5403f1334f447c4c48b5d13599304e110c692011))
* **publish-github:** read correct input for body_path ([ba4f170](https://github.com/shabados/actions/commit/ba4f17092f666577099d7856ae025c8fa296b3e3))


### Features

* **generate-changelog:** add action to generate and commit a changelog ([93f24f2](https://github.com/shabados/actions/commit/93f24f2d377bff7dbaeeb0dd4029fbaee2c7f351))
* **publish-docker:** add build and publish docker action ([5c96af0](https://github.com/shabados/actions/commit/5c96af09bc9f2a07d013e4c5bfc3ae2209598a4c))
* **publish-github:** add support for notifying release on trigger PRs ([3222a51](https://github.com/shabados/actions/commit/3222a516877f5936805131382a3b2b84d665a58c))
* **publish-github:** allow fallback to env for github_token ([823bf87](https://github.com/shabados/actions/commit/823bf870ab71fc385ef55d1b2be3ce44eb6c237b))
* **publish-npm:** add publish npm action ([c52899c](https://github.com/shabados/actions/commit/c52899c8c41c9e0e3a1805f7490de1b51e6b9181))



# [1.2.0](https://github.com/shabados/actions/compare/v1.2.0-next.0...v1.2.0) (2021-03-14)



# [1.2.0-next.0](https://github.com/shabados/actions/compare/v1.1.0...v1.2.0-next.0) (2021-03-14)


### Features

* **publish-github:** use tag name as release name ([cecf22a](https://github.com/shabados/actions/commit/cecf22aa673318360ce80032392cd25008248ae9))



# [1.1.0](https://github.com/shabados/actions/compare/v1.1.0-next.3...v1.1.0) (2021-03-14)



# [1.1.0-next.3](https://github.com/shabados/actions/compare/v1.1.0-next.2...v1.1.0-next.3) (2021-03-14)



# [1.1.0-next.2](https://github.com/shabados/actions/compare/v1.1.0-next.1...v1.1.0-next.2) (2021-03-14)



# [1.1.0-next.1](https://github.com/shabados/actions/compare/efa7ddef0dad497e86bdcf72ae9cb84d04a718d1...v1.1.0-next.1) (2021-03-14)


### Bug Fixes

* **bump-version:** load angular preset manually ([07a3a2f](https://github.com/shabados/actions/commit/07a3a2f7444e9256128432c199209d807e2cc91f))
* **publish-branch:** force push to release branches ([635a7aa](https://github.com/shabados/actions/commit/635a7aa646ab406baa391e9f99875d82be7de245))
* **publish-github:** accept github token input ([9914ea8](https://github.com/shabados/actions/commit/9914ea864b9fb90f224d400adaef67c97732f9d6))
* **publish-github:** ensure tags are pushed ([ffd792c](https://github.com/shabados/actions/commit/ffd792c5dbde60657c95a0d235631a1e96f5e364))
* **publish-github:** import globber correctly ([0cdb15d](https://github.com/shabados/actions/commit/0cdb15d89c46561450f3240009124b93f51c94eb))
* **publish-github:** remove extraneous space in git raw command ([95e54c3](https://github.com/shabados/actions/commit/95e54c3ee3ad721e2a73a12ff4d8cf1987881cec))
* **publish-github:** upload asset paths as names ([e75178d](https://github.com/shabados/actions/commit/e75178d914692d4c661d701bc48d6152fde16421))


### Features

* **bump-version:** add [skip ci] to commit message ([ac8dea2](https://github.com/shabados/actions/commit/ac8dea27262ca152f43fbb70e8126221ee02a8b1))
* **bump-version:** add bump version action ([#12](https://github.com/shabados/actions/issues/12)) ([efa7dde](https://github.com/shabados/actions/commit/efa7ddef0dad497e86bdcf72ae9cb84d04a718d1))
* **bump-version:** add has_changed output ([921d0c4](https://github.com/shabados/actions/commit/921d0c45e7e540d4df46334c6ba1890a637aab64))
* **bump-version:** add previous and next version outputs ([#15](https://github.com/shabados/actions/issues/15)) ([6b63a44](https://github.com/shabados/actions/commit/6b63a44b6f7e13d82c57911f1b207e5626e5a231))
* **publish-branch:** add action to publish release branches ([#17](https://github.com/shabados/actions/issues/17)) ([c043da9](https://github.com/shabados/actions/commit/c043da91d2bf064227fadd893c3938253994b981))
* **publish-branch:** append to gitignore instead of replacing it ([1d229f9](https://github.com/shabados/actions/commit/1d229f9d4fb6b52be260262a33f83bacdbeb5e1d))
* **publish-github:** add publish github action ([#16](https://github.com/shabados/actions/issues/16)) ([c48e63d](https://github.com/shabados/actions/commit/c48e63d6913655b83701c881eb71301791b4a736))
* **setup-git-identity:** add action to set up default git identity ([b19cd8e](https://github.com/shabados/actions/commit/b19cd8e4bbdbb222ffa1ba22cb369f71a864c655))



