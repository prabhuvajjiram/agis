# Public contribution and automatic delivery

ASIG's tokens, CSS, documentation and sample-only catalogue can be maintained as an open
source project under the existing MIT license. Product adapters and business workflows
remain in their consuming repositories. Contributions use pull requests and the shared
[contribution checks](CONTRIBUTING.md).

## GitHub Pages

`.github/workflows/ci.yml` validates source, packages and snapshots, runs the browser suite,
and builds `dist/pages/`. On `main`, a successful validation job uploads that artifact and
the dependent deployment job publishes it through the `github-pages` environment.
Pull requests build and validate but never deploy. Manual workflow runs deploy only on `main`.

The artifact contains the catalogue, examples, documentation, licenses and CSS assets.
It excludes repository history, CI files, tests, dependencies and vendored release archives.
The landing page forwards to `site/`. Relative assets and the guidance reader also work
under a project prefix such as `/agis/`.

One-time repository setup, after approving public exposure:

1. Review the full Git history, existing Actions logs/artifacts and examples for secrets or
   internal/customer content before changing repository visibility. Reviewing only the
   current worktree is insufficient. Making the repository private again cannot recall forks.
2. Set repository visibility to public if approved.
3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
4. Restrict the `github-pages` deployment environment to `main`. Protect `main` with pull
   requests and the `validate` check; require approval for workflow changes.
5. Merge the reviewed changes to `main`, or run **ASIG checks** on `main` after setup.

Expected default catalogue URL after successful deployment:
`https://prabhuvajjiram.github.io/agis/`. This is a target URL, not evidence of a live deployment.

## npm releases

`.github/workflows/release.yml` runs when a `v*` Git tag is pushed. It verifies that the tag,
both package versions, the peer dependency and token JSON agree, then runs the source and
browser checks. Only after those pass does it publish tokens, followed by UI patterns.
Versions with a prerelease suffix publish to `next`; stable versions publish to `latest`.
Merging to `main` does not itself publish npm packages.

The workflow uses npm trusted publishing (OIDC) and provenance on GitHub-hosted runners.
Configure a trusted publisher in the settings of **each** existing npm package:

| Setting | Value |
| --- | --- |
| Packages | `@angelstones/design-tokens`, `@angelstones/ui-patterns` |
| Provider | GitHub Actions |
| Organization or user | `prabhuvajjiram` |
| Repository | `agis` |
| Workflow filename | `release.yml` |
| Environment | `npm` |
| Allowed action | Direct publishing with `npm publish` |

Create the matching GitHub `npm` environment and configure release approval/tag restrictions.
Protect release tag creation with a repository ruleset. The workflow no longer requires an
`NPM_TOKEN`; npm-side trust must be configured before the first automatic publish. Do not
remove any existing credentials until you have confirmed which other workflows use them.

The npm account must have two-factor authentication enabled to use `npm trust`; package
ownership and a successful login alone are not sufficient. See
[npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/).

Alternatively, with the installed npm CLI, sign in and configure each publisher:

```sh
npm login
npm trust github @angelstones/design-tokens --repo prabhuvajjiram/agis --file release.yml --env npm --allow-publish
npm trust github @angelstones/ui-patterns --repo prabhuvajjiram/agis --file release.yml --env npm --allow-publish
```

Inspect existing relationships with `npm trust list <package>` before adding duplicates.

For an approved version already committed, merged and tested on `main`, push its matching
tag (for example `v0.7.0` for this release). Never move an existing published release
tag or reuse a published npm version. npm publishes are per package, not atomic: if the
second publish fails, inspect the registry and resume only the unpublished package; rerunning
the entire job will encounter the already-published first package.

After delivery, inspect the final workflow SHA, Pages URL, npm package versions, distribution
tags and provenance. Local tests do not prove hosted CI, publisher setup or deployment.

## Setup verified on September 22, 2026

The owner changed `prabhuvajjiram/agis` to public. Pages is configured with build type
`workflow`; the `github-pages` environment permits only the `main` branch. The `npm`
environment permits `v*` tags. At setup verification, workflow changes awaited publication; hosted delivery must be
confirmed against the final release SHA in Actions. Trusted publishers were created and read back with `npm trust list`
for both packages, matching `prabhuvajjiram/agis`, `release.yml`, environment `npm`, and
direct publishing permission. The 0.6.0 release subsequently published both packages through this workflow; verify each new release independently.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/),
[repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility).
