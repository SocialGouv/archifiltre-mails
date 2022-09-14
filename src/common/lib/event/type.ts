import type { VoidFunction } from "../../utils/type";

export interface Event<TState = unknown> {
    namespace: string;

    readonly state?: Readonly<TState>;
}

export interface EventKeyType {
    /** @deprecated */
    readonly _: Event;
}

/**
 * Corresponding mapped type from a given event id.
 */
export type EventType<TKey extends keyof EventKeyType> = EventKeyType[TKey];
export type EventListener<
    TKey extends keyof EventKeyType = Any,
    TEvent extends Event = EventType<TKey>
> = (event: TEvent) => void;

export type Unsubscriber = VoidFunction;
type InferSubNamespaces<T extends string> = T extends `${infer R}.${infer N}`
    ? `${R}.*` | `${R}.${InferSubNamespaces<N>}`
    : never;

/**
 * Get all unsubscrible namespaces from registered event ids.
 *
 * e.g:
 * ```
 * id = event.myNamespace.mySub.triggered
 * UnsubscribableNamespace<id> =
 *  | event.*
 *  | event.myNamespace.*
 *  | event.myNamespace.mySub.*
 *  | event.myNamespace.mySub.triggered
 * ```
 */
export type UnsubscribableNamespace =
    | {
          [K in keyof EventKeyType]: InferSubNamespaces<K>;
      }[keyof EventKeyType]
    | Exclude<keyof EventKeyType, "_">;
