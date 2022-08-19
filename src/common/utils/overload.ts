type Keys<T> = (keyof T)[];
type Values<T> = T[keyof T][];

interface ObjectOverload {
    getOwnPropertyNames: <T>(o: T) => Keys<T>;
    keys: <T>(o: T) => Keys<T>;
    values: <T>(o: T) => Values<T>;
}
const _Object = Object as ObjectConstructor & ObjectOverload;

export { _Object as Object };

/* eslint-disable @typescript-eslint/method-signature-style */
declare global {
    interface String {
        toUpperCase<T extends string>(this: T): Uppercase<T>;
    }
}
