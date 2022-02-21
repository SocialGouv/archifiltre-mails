# Publication

`Mails` est publié automatiquement suivant certaines règles relatives aux canaux de publication d'une part, ainsi qu'aux systèmes d'opération ciblés d'autre part.
## Canaux de publication
En tout, trois canaux sont configuré dans le déploiement continu : `latest`, `beta`, et `next`

### `latest`
Les versions `latest` de `Mails` sont des versions finales, testées, jalonnées, et livrées. Ce ne sont pas obligatoirement des versions majeures car elles peuvent très bien n'embarquer que des corrections de bug.  
Ces versions ne sont publiées que lorsque la branche [`main`](https://github.com/SocialGouv/archifiltre-mails/tree/main) dans Github est mise à jour manuellement. En général, après qu'une phase de recette soit terminée et validée.

### `beta`
Les versions `beta` de `Mails` sont des versions **non** finales et en cours de test.  
Ces versions ne sont publiées que lorsque la branche [`beta`](https://github.com/SocialGouv/archifiltre-mails/tree/beta) dans Github est mise à jour.  
Cette branche est mise à jour manuellement, autant de fois que nécessaire lors d'une phase de recette pour tester des lots de corrections de bug.  
Les noms de version produits sont itératifs au nombre de fois où une beta sort : e.g `1.0.0-beta.1`, `1.0.0-beta.2`, `1.0.0-beta.3`, etc ...

### `next`
Les versions `next` de `Mails` sont des version **non** finales, non testées, et toujours en cours de développement.  
Ces versions ne sont publiées qu'à partir de la branche [`dev`](https://github.com/SocialGouv/archifiltre-mails/tree/dev) toutes les nuits à 1h du matin **seulement si** des changements sont faits depuis la dernière version next produite ; ou manuellement depuis l'interface de Github.  
Les noms de version produits sont itératifs au nombre de fois où une version next sort pour un numéro de version donné : e.g `1.0.0-next.1`, `1.0.0-next.2`, `1.1.0-next.1`, etc ... Le numéro de version de référence change en fonction des types de modifications apportées au code :
- un bug fix ou un changement de configuration => version patch : e.g `1.0.0` vers `1.0.1`
- une nouvelle fonctionnalité non cassante => version mineure : e.g `1.0.0` vers `1.1.0`
- un changement cassant quel qu'il soit => version majeure : e.g `1.0.0` vers `2.0.0`

Évidemment, nous pouvons forcer une version majeure à tout moment pour raison de commercialisation ou d'identité produit.

## Systèmes d'opération ciblés
`Mails` est aujourd'hui utilisable sur trois systèmes d'opérations : Windows, Linux et MacOS ; les prérequis étant d'être en **64 bit** et d'avoir au minimum **4go de RAM** sur sa machine.  

### Windows
Trois types d'exécutables sont disponibles pour la plateforme Windows : `exe` portable (qui n'a pas besoin d'installation pour être lancé), `msi`, et `exe` auto installable.
### OSX
Pour un système sous OSX (Mac) deux versions sont disponibles : `zip` et `dmg`. Ces versions sont complémentaires car la version zippée est essentielle au bon fonctionnement des mise à jours automatiques. Il est toutefois préférable d'utiliser la version `dmg` pour une première installation.
## Mise à jour automatique
L'application est capable de se mettre à jour automatiquement suivant la canal de distribution choisi. Il n'est en revanche pas possible de mettre à jour automatique d'un canal à l'autre que ce soit en montée ou en descente de version.  
Sous Windows, uniquement la version `exe` auto installable est capable de se mettre à jour automatiquement, pour les autres il faudra obligatoirement télécharger les nouvelles version.
