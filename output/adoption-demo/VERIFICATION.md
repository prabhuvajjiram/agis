# Local verification · 2026-09-23

- All three starters installed dependencies and built successfully; each includes an independent npm lockfile.
- Starter browser suite: 12 behavior/accessibility checks across three frameworks and two viewports, plus one opt-in capture check, passed. Five capture cases are intentionally skipped; ordinary CI skips all six capture cases.
- The four themes retain filter state and pass automated axe checks. Keyboard reset, case-insensitive search, empty state, page reload and narrow-screen table scrolling are exercised.
- Production dependency audits: zero reported vulnerabilities for each starter at verification time.
- Full catalogue suite on macOS: 238 passed, 62 intentional skips.
- Linux catalogue screenshots, quickstart, project-prefix assets and favicons: focused checks passed. One redirect assertion initially needed a retry in emulation. It now explicitly waits for the meta-refresh navigation; the corrected desktop Linux case passed with retries disabled, and all four local viewport cases passed.
- New GitHub Actions workflow passes actionlint. Hosted Actions are the publication gate; see the commit checks for the current result.
- Root `npm run check`, `npm run build:site` and `git diff --check` pass. Published packages, root package version and the 0.7.0 vendored snapshot are unchanged.
- Brag/HyperFrames composition: lint, runtime, layout, motion and all 47 contrast checks pass. Opening, filtered, dark-theme and closing frames were visually reviewed. Studio opens with a clean lint badge and four scene tracks.

The starter and catalogue tests are automated checks, not full application UAT or manual assistive-technology certification. There is no connection to ERP data.

The user approved rendering and publication on 2026-09-23. The final MP4 is H.264, 1920×1080, 30 fps, 600 frames and 20 seconds, with a reviewed poster baked into frame zero. The quickstart includes the video, poster, captions and a descriptive text alternative. No npm version change or ERP update is part of this publication.
