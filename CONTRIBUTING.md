# Contribuer au projet

Archimail est un projet open-source auquel vous pouvez contribuer. Vous retrouverez ci-après les différentes règles et nomenclatures suivies dans ce dépôt.

## Git
### Branches et flux Git
Le projet respecte une version allégée de "[GitFlow](https://danielkummer.github.io/git-flow-cheatsheet/index.fr_FR.html)".

- La branche de développement est `dev`
  - Cette branche est définie comme par défaut dans github
  - Cette branche est protégée contre les commits venants d'utilisateurs non administrateurs
- La branche de production en cours est `main`
  - Cette branche est protégée contre les commits venants d'utilisateurs non administrateurs
- Les branches de fonctionnalités doivent commencer par le préfixe `feature/` ou `feat/`
  - Elles doivent partir de la branche `dev`
  - Elles doivent être fusionnées dans la branche `dev`
- Les branches de correction de bugs doivent commencer par le préfixe `hotfix/` ou `fix/`
  - Quand un bug est détecté dans `dev`
    - Elles doivent partir de la branche `dev`
    - Elle doivent être fusionnée uniquement dans la branche `dev`
  - Quand un bug est détecté dans `main`
    - Elles doivent partir de la branche `main`
    - Elle doivent aussi avoir leurs commits (liés au bug) de picoré ("cherry-pick") vers la branche `dev`
      - Un rebasage ("rebase") est déconseillé car picorer a l'avantage de conserver l'identité des commits concernés
- Les branches liées à l'intégration continue doivent commencer par le préfixe `ci/`
- Les autres préfixes seront interprétés de manière standard (par rapport à l'exécution de la CI)
- Les autres noms de branches (sans préfixe) ne sont pas gérés
- Les multiple préfixes ne considérerons que le premier préfixe vis-à-vis des règles précédentes (ex: `feature/icicle/refacto` => ok feature ; `icicle/feature/refacto` => ko)
- 
