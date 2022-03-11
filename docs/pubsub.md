# PubSub

"Publier / Souscrire" est un service isomorphique global permettant à n'importe quoi de s'abonner à n'importe quel type d'évènement à n'importe quel endroit. Ce module permet simplement de s'abonner du `renderer` vers le `main`, du `renderer` vers le `renderer`, et du `main` vers le `main` .

Lorsque qu'un évènement `main` survient, il est donc diffusé à l'ensemble des souscripteurs en même temps quelque soit leur *process* ou leur nombre.

## Séquence
```mermaid
sequenceDiagram
    autonumber
    participant R as Renderer
    participant PR as PubSub (Renderer)
    participant PM as PubSub (Main)

    rect rgb(255, 255, 255, .1)
    note over R,PM: Subscribe
    R->>PR: subscribe(eventid, listener)
    note over PR: internal save listener<br>generate uuid<br>generate unsub function
    PR->>PR: save in renderer (uuid, unsub)
    PR-->>R: return unsub function
    PR-)PM: ipc(PUBSUB_SUBSCRIBE_EVENT)<br>eventid, uuid
    note over PM: internal generate wrapped<br>listener and unsub functions
    note right of PM: listener wrap the ipc reply<br>with PUBSUB_TRIGGER_EVENT
    PM->>PM: save in main (uuid, unsub)
    end

    rect rgb(255, 255, 255, .1)
    note over R,PM: Publish from main
    PM->>PM: publish localy (eventid, data)
    note right of PM: this includes wrapped listener
    PM-)PM: trigger saved listeners
    PM--)PR: trigger wrapped listener<br>ipc PUBSUB_TRIGGER_EVENT
    PR-)PR: trigger saved listener
    PR-->>R: listener(data)
    end

    rect rgb(255, 255, 255, .1)
    note over R,PM: Unsubscribe
    R->>PR: call unsub fn()
    PR->>PR: remove local listener
    PR->>PM: trigger sync ipc<br>PUBSUB_UNSUBSCRIBE_EVENT<br>with uuid
    PM->>PM: remove local wrapped listener<br>remove in main (uuid, unsub)
    PM-->>R: return delete confirmation
    end
```
