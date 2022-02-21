# Modules et services

Une partie de l'architecture de `Mails` se repose sur une mécanique de modules et de services. Ces paradigmes fonctionnent conjointement afin de délivrer des capabilités encapsulées à l'ensemble de l'application.  
Ces fonctionnalités peuvent être spécifiques à un domaine métier ou au contraire, être *standalone* et purement techniques (comme un système de log par exemple).  
Ces modules et services peuvent être **isomorphiques** dans leur design ; c'est à dire qu'ils peuvent être exécutés ET sur le `main` process ET sur le ou les `renderer` processes.

Du fait d'être développé avec `electron`, l'isomorphisme est un concept très important dominant une bonne partie de l'application.  
Enfin, si un code isomorphique peut être strictement identique et utilisable en `main` et `renderer` ; des modules et services isomorphiques eux peuvent être sur une exécution différente mais doivent le cas échéant s'assurer de la communication entre le front et back.

## Modules
Les modules sont les points d'entrée de groupes de fonctionnalités qui doivent être présents dès le début du cycle de vie de l'application. Un module ne devrait pas avoir ses limites dépassant le scope d'un domaine métier (par exemple, un module gérant l'utilisateur ne devrait pas en même temps gérer l'affichage des devtools car ce sont deux scopes distincts).  
Tout domaine métier n'est/n'a pas obligatoirement besoin d'un module.  

Un module peut être attaché au process `main` et/ou aux processes `renderer`. Dans un cas d'isomorphisme, il faut bien s'assurer de la communication entre les processes (idéalement via `IPC`). Il peut aussi exposer si besoin des services qui lui sont rattachés ; un module ne devant pas être accessible depuis l'extérieur, ces services servent d'*endpoints*.

### Modules actuels
Les modules communs (présents dans common) sont par définition isomorphiques.  
**Common** :
- [ContainerModule](../src/common/modules/ContainerModule.ts) : charge et distribue les services dans l'application
- [UserConfigModule](../src/common/modules/UserConfigModule.ts) : charge la configuration utilisateur sauvegardée
- [I18nModule](../src/common/modules/I18nModule.ts) : charge le moteur de traduction
- [IpcModule](../src/common/modules/IpcModule.ts) : rend accessible des fonctionnalités `main` à travers le protocole IPC
- [FileExporterModule](../src/common/modules/FileExporterModule.ts) : expose différents types d'`exporter` pour convertir des données dans un format de fichier choisi. (`json`, `csv`, `xlsx`, ...)

**Main** :
- [DevToolsModule](../src/main/modules/DevToolsModule.ts) : récupère et injecte les extensions de dev tools
- [PstExtractorModule](../src/main/modules/PstExtractorModule.ts) : prépare un worker pour extraire le contenu d'un PST
- [AppModule](../src/main/modules/AppModule.ts) : permet l'initialisation de paramètres globaux relatif à l'application elle même (comme la bloquer la navigation, ou afficher une fenêtre de confirmation de fermeture)
- [MenuModule](../src/main/modules/MenuModule.ts) : gère le menu de l'application. (cf [menu](#menu))

**Renderer** :
- [ConsoleFromMainModule](../src/renderer/modules/ConsoleFromMainModule.ts) : petit module permettant de réceptionner des `console.log` venant du main et de les afficher dans la console du renderer.


### Menu
Le `MenuModule` est un wrapper autour du composant de gestion des menus d'electron. Sa principale utilité est de remplacer le menu d'origine par un menu personnalisé et de gérer les actions associés.  
Pour ajouter un menu, il suffit d'implémenter l'interface `ArchifiltreMailsMenu` et d'ajouter l'instance du nouveau menu au module. (cf. [`DebugMenu`](../src/main/modules/menu/DebugMenu.ts) pour un exemple d'implémentation).

### i18n
Le `I18nModule` est un wrapper autour du package `i18next` permettant d'en exposer tout le moteur de traduction que ce soit dans le `main` ou dans le `renderer`. (cf [i18n](./i18n.md))

## ContainerModule et Services
Le `ContainerModule` est responsable de regrouper, charger, et distribuer les services dans l'application. Il peut être considéré comme étant une `Map` où les clés sont les noms des services, et les valeurs les services eux mêmes. Au début de l'application, le container va essayer de d"*init* tous les services en parallèle (seulement si la méthode `init` est disponible ; un service pouvant aussi par exemple être une simple constante/valeur), une fois ce chargement effectué, il n'est plus possible d'ajouter de nouveaux services dans le container.  

Un service quand à lui est l'exposition de fonctionnalités, métier ou non, disponibles partout dans la partie de l'application où il est déclaré (`common` disponible pour tous, `main` seulement, ou `renderer` seulement). Un service peut être un point de sortie d'un module ; mais un service peut aussi être *standalone*. À l'instar d'un module, ce qui importe est qu'il soit enregistré au début de l'application ou/et d'une page (si isomorphique).

### `WaitableTrait`
Le [trait](https://github.com/lsagetlethias/tstrait) `WaitableTrait` permet d'étendre une class, généralement un service, afin de lui donner la capacité d'être "attendu" avant son utilisation. Les services ayant des méthode d'initialisation, cette mécanique permet de s'assurer que cette initialisation est bien achevée avant que le service en question ne soit utilisé.

## Common vs Main vs Renderer
Lors de sa conception, un module doit être réfléchi suivant le plus niveau d'abstraction dans lequel il sera utilisé.

> <u>Exemples:</u>
>- Une traduction, peut être utilisé tant en `main` (lors de l'ouverture de modale native par exemple), qu'en `renderer` directement dans l'interface. Le module I18n devra donc être dans `common`.
>- Ouvrir une fenêtre modale native afin de récupérer un chemin de fichier choisi par l'utilisateur (`dialog.showSaveDialog`) est une fonctionnalité `main` exclusivement qui peut avoir une utilité lors d'interactions ; elle peut donc être exposée (comme d'autre) au `renderer` via le protocole IPC. Le module IPC devra donc être dans `common` afin que le `main` puisse d'une part initialiser la communication, et que le `renderer` puisse la consommer d'autre part.
>- Gérer le comportement global de l'application (fermeture, blocage du rechargement, titre, etc), n'a aucune utilité pour un utilisateur final. Le module d'application devra donc être dans `main` seulement.

Cette logique s'applique également aux services et ce en complément d'une dualité avec les modules. Comme dit précédemment, les services peuvent être des extensions de module servant à exposer des fonctionnalités initialisées par ces derniers.  
Il peut toute fois arriver qu'un service ne sera utile que pour un seul process.

> <u>Exemple:</u>  
> Charger le PST dans l'application est une action menée par un utilisateur (dans le `renderer`) au début de l'application mais dont le traitement est effectué dans le `main`. Rien dans le `main` n'a pour l'instant de charger un PST sans action humaine initiale. Il faut donc un module `main` qui initiera la mécanique de chargement et exposera la fonctionnalité, et un service *standalone* côté `renderer` qui la consommera.
