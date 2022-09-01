import type { Any, Objectize } from "./type";

type Keys<T> = Objectize<(keyof T)[]>;
type Values<T> = Objectize<T[keyof T][]>;

interface ObjectOverload {
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

/* eslint-disable @typescript-eslint/method-signature-style */
declare global {
    interface String {
        toUpperCase<T extends string>(this: T): Uppercase<T>;
    }

    interface Array<T> {
        map<TU, TThis extends T[]>(
            this: TThis,
            callbackfn: (value: T, index: number, array: T[]) => TU,
            thisArg?: Any
        ): ChangeTuple<TThis, TU>;
    }
}
