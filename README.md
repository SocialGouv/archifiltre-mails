# archimail

## Initialisation
```sh
yarn install
yarn devtools
```

## Lancement
```sh
yarn dev
```

### Utiliser le debugger dans le main
```sh
yarn debug
```
Puis dans le "Run & Debug" de VSCode : "Attach to Electron"

## TODO
- [ ] tests vs specs
  - [ ] coverage + push result
  - [ ] snapshots
  - [ ] spectron
- [ ] Sign + notarize + build + deploy
  - [ ] Release channels (stable, beta, canary)
- [ ] Auto update (electron-builder code pusher)
- [ ] CI (tests, coverage, generate build)
### Services
- [ ] Logger (winston + sentry + console + "renderer transport to main")
- [ ] Tracker (matomo)
- [ ] Generic ipcServices (preLoad expose + [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)?)

### Doc
- [ ] Tech doc tool (docusaurus? next? jekyll?) + github pages
- [ ] CONTRIBUTING
- [ ] README
- [ ] CHANGELOG tech
- [ ] UPGRADE
