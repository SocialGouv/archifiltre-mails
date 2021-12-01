# Modules et services

Une partie de l'architecture d'Archimail se repose sur une mécanique de modules et de services. Ces paradigmes fonctionnent conjointement afin de délivrer des capabilités encapsulées à l'ensemble de l'application.  
Ces fonctionnalités peuvent être spécifiques à un domaine métier ou au contraire, être *standalone* et purement techniques (comme un système de log par exemple).  
Ces modules et services peuvent être **isomorphiques** dans leur design ; c'est à dire qu'ils peuvent être exécutés ET sur le `main` process ET sur le ou les `renderer` processes.

Du fait d'être développé avec `electron`, l'isomorphisme est un concept très important dominant une bonne partie de l'application.  
Enfin, si un code isomorphique peut être strictement identique et utilisable en `main` et `renderer` ; des modules et services isomorhiques eux peuvent être sur une exécution différente mais doivent le cas échéant s'assurer de la communication entre le front et back.

## Modules
Les modules sont les points d'entrée de groupes de fonctionnalités qui doivent être présents dès le début du cycle de vie de l'application. Un module ne devrait pas avoir ses limites dépassant le scope d'un domaine métier (par exemple, un module gérant l'utilisateur ne devrait pas en même temps gérer l'affichage des devtools car ce sont deux scopes distincts).  
Tout domaine métier n'est/n'a pas obligatoirement besoin d'un module.  

Un module peut être attaché au process `main` et/ou aux processes `renderer`. Dans un cas d'isomorphisme, il faut bien s'assurer de la communication entre les processes (idéalement via `IPC`). Il peut aussi exposer si besoin des services qui lui sont rattachés ; un module ne devant pas être accessible depuis l'extérieur, ces services servent d'*endpoints*.

### Modules actuels
Les modules communs (présents dans common) sont par définition isomorphiques.  
**Common** :
- [ContainerModule](../src/common/modules/ContainerModule.ts) : charge et distribue les services dans l'application
- [UserConfigModule](../src/common/modules/UserConfigModule.ts) : charge la configuration utilisateur sauvegardée

**Main** :
- [DevToolsModule](../src/main/modules/DevToolsModule.ts) : récupère et injecte les extensions de dev tools
- [PstExtractorModule](../src/main/modules/PstExtractorModule.ts) : prépare un worker pour extraire le contenu d'un PST
- [AppModule](../src/main/modules/AppModule.ts) : permet l'initialisation de paramètres globaux relatif à l'application elle même (comme la bloquer la navigation, ou afficher une fenêtre de confirmation de fermeture)
- [MenuModule](../src/main/modules/MenuModule.ts) : gère le menu de l'application. (cf [menu](#menu))

**Renderer** :
- [ConsoleFromMainModule](../src/renderer/modules/ConsoleFromMainModule.ts) : petit module permettant de réceptionner des `console.log` venant du main et de les afficher dans la console du renderer.

## ContainerModule et Services
Le `ContainerModule` est responsable de regrouper, charger, et distribuer les services dans l'application. Il peut être considéré comme étant une `Map` où les clés sont les noms des services, et les valeurs les services eux mêmes. Au début de l'application, le container va essayer de d"*init* tous les services en parallèle (seulement si la méthode `init` est disponible ; un service pouvant aussi par exemple être une simple constante/valeur), une fois ce chargement effectué, il n'est plus possible d'ajouter de nouveaux services dans le container.  

Un service quand à lui est l'exposition de fonctionnalités, métier ou non, disponibles partout dans l'application. Un service peut être un point de sortie d'un module ; mais un service peut aussi être *standalone*. À l'instar d'un module, ce qui importe est qu'il soit enregistré au début de l'application ou/et d'une page (si isomorphique).

## Menu
Le `MenuModule` est un wrapper autour du composant de gestion des menus d'electron. Sa principale utilité est de remplacer le menu d'origine par un menu personnalisé et de gérer les actions associés.  
Pour ajouter un menu, il suffit d'implémenter l'interface `ArchimailMenu` et d'ajouter l'instance du nouveau menu au module. (cf. [`DebugMenu`](../src/main/modules/menu/DebugMenu.ts) pour un exemple d'implémentation).
