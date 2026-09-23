# ASIG adoption demo

A 20-second silent, captioned demo made with the [brag workflow](https://github.com/latent-spaces/brag) and HyperFrames 0.8.64. The approved delivery files are in `site/assets/adoption/` and are embedded in the quickstart.

- `brag-plan.md`: claims, source evidence, storyboard and distribution scope.
- `index.html` and `compositions/scene-*.html`: editable, deterministic composition and four scene timelines.
- `assets/orders-*.png`: actual JavaScript starter states, captured by browser tests.
- `assets/inter.woff2`: Inter, SIL OFL; license included.
- `assets/logo.png`: existing Angel Stones brand asset.
- `assets/gsap.min.js`: GSAP 3.14.2, standard license link in its header; https://gsap.com/standard-license/.
- `references/line-by-line-slide.html.txt`: upstream HyperFrames registry reference; its headline recipe is adapted in the four scene compositions.

Run `npm run check`, then `npx --yes hyperframes@0.8.64 preview --background`. The preview was approved on 2026-09-23. Review subsequent visual changes in Studio before rendering.

To refresh the UI captures: build all three starters, then run `ASIG_CAPTURE_DEMO=1 npx playwright test --config playwright.starters.config.mjs` from the repository root.

Share-copy draft (publish only after deployment):

> One design language, your framework. Try ASIG's standalone JavaScript, Next.js and Angular starters: search, filter and switch themes while your application owns the behavior. Start here: https://prabhuvajjiram.github.io/agis/site/start.html
