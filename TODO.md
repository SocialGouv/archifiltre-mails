# TODO
- [x] tests vs specs
  - [x] jest component tests + snapshots (Storybook ? (for visual regression tests))
  - [x] jest integration tests
  - [x] playwright e2e tests
  - [x] coverage + push result (https://dev.to/penx/combining-storybook-cypress-and-jest-code-coverage-4pa5)
- [x] Sign + notarize + build + deploy
  - [x] Release channels (stable, beta, canary)
- [x] Auto update (electron-builder code pusher)
- [x] CI
  - [x] tests
  - [x] coverage
  - [x] generate build
## Services
- [ ] Logger (winston + sentry + console + "renderer transport to main")
- [ ] Tracker (matomo/metabase)
- [x] global and user config (shared over ipc)
- [x] i18n (i18next + react-i18next (start [here](./src/common/i18n/)))

## Doc
- [ ] Tech doc tool (docusaurus? next? jekyll?) + github pages
- [x] CONTRIBUTING
- [x] README
- [x] CHANGELOG tech (https://keepachangelog.com/en/1.0.0/)

## Recette
- [ ] Issue template
- [ ] beta branch usage
- [ ] ownership

## Infra / Archi
- [ ] change build system to vite-electron-builder (https://github.com/cawa-93/vite-electron-builder)
