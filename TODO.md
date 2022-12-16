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


## Eml and co
- [x] eml export folder
- [x] eml body content not visible in outlook or osx info
- [ ] pst extractor indexes => descriptorId
- [ ] eml export parallel ops
- [x] test csv export
- [x] windows installer appId shortcut regedit
- [ ] windows open pst error (db?) 

## Work manager
- [x] basic save/load
- [x] add additionnal metadata (owner, deleted/keep, deleted folder)
- [x] either encode file and/or add security control (id field, check that pst file is in the same dir, checksum)
- [x] change dropzone and savemodal texts
- [x] "open" pst in fetcher-worker OR act as "downgraded" mode without email content nor attachments
- [x] add tracking on save/load
- [x] BONUS: add toast when any export/import is complete
- [x] BONUS: add progressbar (electron + front) for export and electron-only for import (https://www.electronjs.org/fr/docs/latest/api/browser-window#winsetprogressbarprogress-options)

## Notifications
- [x] React toastify
- [ ] Check for fix issue: stuck on version 9.0.3. Above versions use Webpack 5 and there is a lack of support for es modules. Check release info : https://github.com/fkhadra/react-toastify/releases/tag/v9.0.4 and issue : https://github.com/fkhadra/react-toastify/issues/775
- [x] Global notifications


## Edge cases
- [ ] When a drop file is a .json, verify if it's possible to save it. 
- [x] windows open pst error (db?) 
