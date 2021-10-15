# Modules et services

Une partie de l'architecture d'Archimail se repose sur une mécanique de modules et de services. Ces paradigmes fonctionnent conjointement afin de délivrer des capabilités encapsulées à l'ensemble de l'application.  
Ces fonctionnalités peuvent être spécifiques à une domaine métier ou au contraire, être *standalone* et purement techniques (comme un système de log par exemple).  
Ces modules et services peuvent être **isomorphiques** dans leur design ; c'est à dire qu'ils peuvent être exécutés et sur le `main` process ET sur le ou les `renderer` processes.

Du fait d'être sur `electron`, l'isomorphisme est un concept très important dominant une bonne partie de l'application.

## Modules

### Modules actuels

## ContainerModule et Services
