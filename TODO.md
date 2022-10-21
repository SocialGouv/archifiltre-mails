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
- [x] Logger (winston + sentry + console + "renderer transport to main")
- [x] Tracker (posthog)
- [x] global and user config (shared over ipc)
- [x] i18n (i18next + react-i18next (start [here](./src/common/i18n/)))
- [x] pub/sub
- [x] config view
- [ ] send bug
- [x] check for update
- [ ] Isomorphic electron mock ?
- [ ] Use preload + sandbox
- [ ] move common electron + Archifiltre code to 3rd party package
- [x] migrate from jotai to zustand 4 

## Doc
- [ ] Tech doc tool (docusaurus? next? jekyll?) + github pages
- [x] CONTRIBUTING
- [x] README
- [x] CHANGELOG tech (https://keepachangelog.com/en/1.0.0/)

## Recette
- [x] Issue template
- [x] beta branch usage
- [x] ownership

## Infra / Archi
- [ ] change build system to vite-electron-builder (https://github.com/cawa-93/vite-electron-builder)


## eml and co
- [x] eml export folder
- [x] eml body content not visible in outlook or osx info
- [ ] pst extractor indexes => descriptorId
- [ ] eml export parallel ops
- [x] test csv export
- [x] windows installer appId shortcut regedit
- [x] windows open pst error (db?) 
