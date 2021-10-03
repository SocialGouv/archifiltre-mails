# archimail
[![codecov](https://codecov.io/gh/SocialGouv/archimail/branch/main/graph/badge.svg?token=JPCHQWKTKZ)](https://codecov.io/gh/SocialGouv/archimail)

## Initialisation
```sh
yarn install
```

## Développement
### Installation des devtools (unix seulement)
```sh
yarn devtools
```

### Lancement
```sh
yarn dev
```

### Utiliser le debugger dans le main
```sh
yarn debug
```
Puis dans le "Run & Debug" de VSCode : "Attach to Electron"

## Tests
### Composants et intégration
```sh
yarn test

# ou pour les composants seulement
yarn test:components
# sinon
yarn test components

# ou pour l'integration seulement
yarn test:integration
# sinon
yarn test integration
```
Jest est utilisé en interne, donc les différents drapeaux de ligne de commande sont utilisable (comme `--watch` par exemple)

### E2E
Les tests E2E sont basé sur [Playwright](https://playwright.dev/). Il faut donc installer ses dépendances avant de pouvoir les lancer en local. Pour ça, déclarer la variable d'environnement `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` à 1 puis lancer l'installation.
Shell :
```sh
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 yarn playwright install-deps chromium
```
PowerShell :
```PowerShell
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1; yarn playwright install-deps chromium
```
Batch :
```bat
set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 & yarn playwright install-deps chromium
```

Lancer ensuite les tests avec la commande suivante :
```sh
yarn test:e2e
```

#### Cas Linux Headless / WSL2
Dans des cas de CI ou de noyau Linux "headless" (comme pour WSL2), il est important de lancer en amont un serveur graphique auquel les applications fenêtrées pour s'attacher.  
`XVFB` étant soit déjà présent sur la machine, soit dans tous les cas installé avec les dépendances de Playwright il suffit de le lancer soit en tâche de fond, soit dans une fenêtre annexe. (`xvfb-run` en exécution directe étant déconseillé)

```sh
# lancement dans un fenêtre
/usr/bin/Xvfb :0 -ac -screen 0 1280x1024x24

# ou pour lancer en tâche de fond ----------v
/usr/bin/Xvfb :0 -ac -screen 0 1280x1024x24 &
```

## License
Sous license [Apache-2.0](LICENSE)

## TODO
- [x] tests vs specs
  - [x] jest component tests + snapshots (Storybook ? (for visual regression tests))
  - [x] jest integration tests
  - [x] playwright e2e tests
  - [x] coverage + push result (https://dev.to/penx/combining-storybook-cypress-and-jest-code-coverage-4pa5)
- [ ] Sign + notarize + build + deploy
  - [ ] Release channels (stable, beta, canary)
- [ ] Auto update (electron-builder code pusher)
- [ ] CI
  - [x] tests
  - [x] coverage
  - [ ] generate build
### Services
- [ ] Logger (winston + sentry + console + "renderer transport to main")
- [ ] Tracker (matomo) (le casse 🍒)
- [ ] Generic ipcServices (preLoad expose + [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)?)

### Doc
- [ ] Tech doc tool (docusaurus? next? jekyll?) + github pages
- [ ] CONTRIBUTING
- [ ] README
- [ ] CHANGELOG tech (https://keepachangelog.com/en/1.0.0/)
- [ ] UPGRADE
