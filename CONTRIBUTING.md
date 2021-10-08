Archimail est un projet open-source auquel vous pouvez contribuer. Vous retrouverez ci-après les différentes règles et nomenclatures suivies dans ce dépôt.

- [Git](#git)
  - [Branches et flux Git](#branches-et-flux-git)
  - [Commit](#commit)
  - [Pull request](#pull-request)
- [Produit](#produit)
  - [Tickets et fonctionnalités](#tickets-et-fonctionnalités)
- [Intégration continue et tests](#intégration-continue-et-tests)
  - [CI: QA + tests classiques](#ci-qa--tests-classiques)
  - [E2E](#e2e)
- [Déploiement continu + sortie de version](#déploiement-continu--sortie-de-version)

# Git
## Branches et flux Git
Le projet respecte une version allégée de "[GitFlow](https://danielkummer.github.io/git-flow-cheatsheet/index.fr_FR.html)".

- 🧑‍💻 La branche de développement est `dev`
  - Cette branche est définie comme par défaut dans github
  - Cette branche est protégée contre les commits venants d'utilisateurs non administrateurs
- 🏷️ La branche de production en cours est `main`
  - Cette branche est protégée contre les commits venants d'utilisateurs non administrateurs
- ✨ Les branches de fonctionnalités doivent commencer par le préfixe `feature/` ou `feat/`
  - Elles doivent partir de la branche `dev`
  - Elles doivent être fusionnées dans la branche `dev`
- 🐛 Les branches de correction de bugs doivent commencer par le préfixe `hotfix/` ou `fix/`
  - Quand un bug est détecté dans `dev`
    - Elles doivent partir de la branche `dev`
    - Elle doivent être fusionnée uniquement dans la branche `dev`
  - Quand un bug est détecté dans `main`
    - Elles doivent partir de la branche `main`
    - Elle doivent aussi avoir leurs commits (liés au bug) de picoré (🍒 "cherry-pick") vers la branche `dev`
      - Un rebasage ("rebase") **est déconseillé** car picorer a l'avantage de conserver l'historique des commits sur la branche d'arrivée
- 👷 Les branches liées à l'intégration continue doivent commencer par le préfixe `ci/` ou `ci-*/`
- Les autres préfixes seront interprétés de manière standard (par rapport à l'exécution de la CI)
- Les autres noms de branches (sans préfixe) ne sont pas gérés
- Les multiples préfixes ne considérerons que le premier préfixe vis-à-vis des règles précédentes (ex: `feature/icicle/refacto` => ok feature ; `icicle/feature/refacto` => ko)
  - Exception faite pour les branches `*/e2e/*` (ex: `feature/e2e/icicle`, `hotfix/e2e/bug-chargement-empreinte`) qui adoptent cette nomenclature afin de déclencher les tests e2e en plus dans la CI
- 🤖 Les branches préfixées `renovate/` sont réservées et ne doivent pas être utilisées

### Représentation imagée :
![Archimail presque-"Git-flow"](./docs/img/archimail-git-flow.svg)


## Commit
La convention de commit adoptée par le projet est [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) MAIS cette convention n'est imposée que sur les branches principales `dev` et `main`.  
En effet, les pull requests étant "squash", seul importe le commit de merge en fin de pull request.  
[Gitm😍 ji](https://gitmoji.dev/) peut donc par exemple être utilisé à l'intérieur des branches si besoin.

## Pull request
Pour chaque fonctionnalité apportée ou bug corrigé, une pull request doit être faite.  
Il faut obligatoirement lier une pull request à un ticket, sans ça, elle n'a aucun intérêt.  
Vous pouvez vous aider du template prévu à cet effet. Il est important de bien respecter la convention [Semantic Pull Request](https://github.com/zeke/semantic-pull-requests) pour le titre des pull requests.  
Comme dit plus haut, le format des commits sera ignoré au profit d'un squash de merge à la cloture de la pull request.

# Produit
## Tickets et fonctionnalités
Les fonctionnalités suivent le processus de développement suivant :
- Une idée arrive dans le [tableau des idées](https://github.com/orgs/SocialGouv/projects/10) (accès interne)
- Cette idée est évaluée, travaillée, puis transformée en ticket pour le [backlog global](https://github.com/orgs/SocialGouv/projects/9) (accès interne) avec le label "archimail"
- Ce ticket est une nouvelle fois travaillé pour être soit transformé en EPIC soit rattaché à une EPIC existante
  - Si il devient une EPIC, il acquiert le label "EPIC" et reste dans le même tableau
  - Si il est rattaché à une EPIC, il est raffiné puis transféré vers le [tableau de sprint d'Archimail](https://github.com/SocialGouv/archimail/projects/4) (accès public)

Un ticket est toujours estimé avec une valeur business et une complexité, mesurés avec la technique du **T-shirt sizing** (*S*, *M*, *L*, *XL*).
![Qualification des tickets](docs/img/ticket-grooming.png)

Un ticket est autant que possible accompagné de critères d'acceptance définis entre la qualité et la définition du besoin. Ces critères sont la représentation des tests d'intégration et/ou E2E qui seront créés pour valider la fonctionnalité associée.

Un ticket est considéré comme terminé (*DoD*) lorsque les conditions suivantes sont remplies :
- Les critères d'acceptances ont été respectés
- Tous les tests d'intégration passent au vert ✅
- Si la valeur business est *XL* (ou *L* si besoin), tous les tests E2E passent au vert ✅
  - (voir [E2E](#e2e))
- En respect de l'engagement de sécurité, 1 review obligatoire à partir de la complexité *M*

# Intégration continue et tests
Trois types de tests sont mis en place dans l'application : composants, intégration, et end-to-end (*E2E*).
Les tests de composants sont comme des tests unitaires, à écrire autant que possible pour limiter au maximum les potentiels régressions graphiques.  
Les tests d'intégration peuvent être liés aux critères d'acceptances (ou à une partie) afin de tester une fonctionnalité précise dans son ensemble.  
Les tests E2E sont fortement et souvent liés aux critères d'acceptances en plus d'être "scénarisés" pour être ensuite développés et exécutés pendant les phases de recette.

## Bots
Régulièrement, des bots de contrôle passent sur le code pour garantir le maintiens des dépendances à jour (Renovate 🧹), ainsi que l'application de leurs derniers patch de sécurité (Dependabot 🤖).

## CI: QA + tests classiques
Les tests se situent dans le dossier [`./tests/`](./tests/) et peuvent être exécutés avec la commande `yarn test`.  
Automatiquement, les pull requests dont les branches sont à destination de `dev` et `main` sont contrôlées sur leur qualité via [CodeQL](https://codeql.github.com/) ainsi que sur notre CI interne.  
Notre CI contrôlera de son côté l'uniformité du code (`lint`) et lancera les tests "classiques" (composants et intégration).

## E2E
Les tests E2E se situent dans le dossier [`./tests/e2e/`](./tests/e2e/) et peuvent être exécutés avec la commande `yarn test:e2e`.  
Attention toutefois à bien installer les prérequis en amont. (cf [README](./README.md#e2e)).  

Les tests e2e s'exécuteront automatiquement dans la CI suivant l'une de ces conditions :
- toutes les nuits, avant un jour de semaine travaillé, à 1h du matin sur la branche `dev`
- à chaque pull request en direction de la branche `main`
- à chaque push sur les branches `ci-e2e/*` ou `*/e2e/*`

Les tests e2e seront automatiquement lancés sur les trois systèmes d'exploitation ciblés, à savoir Linux Ubuntu, Windows, et MacOS.  
Il est donc important dans le cas de code spécifique à l'un des OS de bien définir une non exécution des tests pour les autres.

# Déploiement continu + sortie de version
TODO

# Code
TODO
