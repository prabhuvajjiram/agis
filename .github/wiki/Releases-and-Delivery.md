# Releases and delivery

## Version channels

**0.7.0 is the stable release line.** Stable versions publish under npm's `latest` tag;
prereleases use `next`. Keep design tokens and UI patterns on matching versions.
Installed applications change only when their dependencies are upgraded.

The catalogue follows `main`, which may contain changes ahead of a published package.
Use [GitHub Releases](https://github.com/prabhuvajjiram/agis/releases) and the npm registry to verify available versions:

- [Design tokens](https://www.npmjs.com/package/@angelstones/design-tokens)
- [UI patterns](https://www.npmjs.com/package/@angelstones/ui-patterns)

## Delivery flow

| Trigger | Validation and outcome |
| --- | --- |
| Pull request | Source, package, snapshot and browser checks; no deployment |
| Push to `main` | Checks pass, then the catalogue deploys to GitHub Pages |
| Push a matching `v*` release tag | Version alignment and checks pass, then both packages publish with provenance |

npm publishing uses a trusted GitHub Actions identity bound to `release.yml` and the
`npm` environment. A long-lived npm publishing token is not required. GitHub Pages uses
the `github-pages` environment and permits `main` deployments.

Check the [Actions runs](https://github.com/prabhuvajjiram/agis/actions), the live catalogue and the registry after a
release. npm publishes are per package; if the second fails, resume only the missing
package after investigating the failure.

See [automation setup](https://github.com/prabhuvajjiram/agis/blob/main/docs/AUTOMATION.md),
[distribution](https://github.com/prabhuvajjiram/agis/blob/main/docs/DISTRIBUTION.md) and the
[changelog](https://github.com/prabhuvajjiram/agis/blob/main/CHANGELOG.md).
