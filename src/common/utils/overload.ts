import { last } from "lodash";

import type { Objectize } from "./type";

type Keys<T> = Objectize<(keyof T)[]>;
type Values<T> = Objectize<T[keyof T][]>;
type Entries<T> = Objectize<
    {
        [K in keyof T]: [K, T[K]];
    }[keyof T][]
>;

interface ObjectOverload {
    entries: <T>(o: T) => Entries<T>;
    getOwnPropertyNames: <T>(o: T) => Keys<T>;
    keys: <T>(o: T) => Keys<T>;
    values: <T>(o: T) => Values<T>;
}
const _Object = Object as ObjectOverload &
    Omit<ObjectConstructor, keyof ObjectOverload>;

export { _Object as Object };

type ChangeTuple<TInput extends Any[], TOutputType> = {
    [K in keyof TInput]: TOutputType;
};

Array.prototype.last = function <T>() {
    return last<T>(this);
};

/* eslint-disable @typescript-eslint/method-signature-style */
declare global {
    interface String {
        toUpperCase<T extends string>(this: T): Uppercase<T>;
    }

    interface Array<T> {
        last<TThis extends T[]>(this: TThis): T | undefined;

        map<TU, TThis extends T[]>(
            this: TThis,
            callbackfn: (value: T, index: number, array: T[]) => TU,
            thisArg?: Any
        ): ChangeTuple<TThis, TU>;
    }
}
