# Modules et services

Une partie de l'architecture d'Archimail se repose sur une mécanique de modules et de services. Ces paradigmes fonctionnent conjointement afin de délivrer des capabilités encapsulées à l'ensemble de l'application.  
Ces fonctionnalités peuvent être spécifiques à une domaine métier ou au contraire, être *standalone* et purement techniques (comme un système de log par exemple).  
Ces modules et services peuvent être **isomorphiques** dans leur design ; c'est à dire qu'ils peuvent être exécutés et sur le `main` process ET sur le ou les `renderer` processes.

Du fait d'être développée avec `electron`, l'isomorphisme est un concept très important dominant une bonne partie de l'application.

## Modules
Les modules sont les point d'entrée de groupes de fonctionnalités qui doivent présents dès le début du cycle de vie de l'application. Un module ne devrait avoir ses limites dépassant le scope d'un domaine métier (par exemple, un module gérant l'utilisateur ne devrait pas en même temps gérer l'affichage des devtools car ce sont deux scopes distincts).  
Tout domaine métier n'est/n'a pas obligatoirement un module.  

Un module peut être attaché au process `main` et/ou aux processes `renderer`. Dans un cas d'isomorphisme, il faut bien s'assurer d'assurer la communication entre les processes (idéalement via `IPC`). Il peut aussi exposer si besoin des services qui lui sont rattachés ; un module ne devant pas être accessible depuis l'extérieur, ces services servent d'*endpoints*.

### Modules actuels
Les modules communs (présents dans common) sont par définition isomorphiques.  
**Common** :
- [ContainerModule](../src/common/modules/ContainerModule.ts) : charge et distribue les services dans l'application
- [UserConfigModule](../src/common/modules/UserConfigModule.ts) : charge la configuration utilisateur sauvegardée

**Main** :
- [DevToolsModule](../src/main/modules/DevToolsModule.ts) : récupère et injecte les extensions de dev tools

## ContainerModule et Services
Le `ContainerModule` est responsable de regrouper, charger, et distribuer les services dans l'application. Il peut être considéré comme étant une `Map` où les clés sont les noms des services, et les valeurs les services eux mêmes. Au début de l'application, le container va essayer de d"*init* tous les services en parallèle (seulement si la méthode `init` est disponible), une fois ce chargement effectué, il n'est plus possible d'ajouter de nouveau services dans le container.  

Un service est l'exposition de fonctionnalités métier ou non, disponible partout dans l'application.
