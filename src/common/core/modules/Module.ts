export interface Module {
    init: () => Promise<void>;
}

const factory = new Map<string, Module>();
export const IsomorphicModuleFactory = {
    getInstance<T extends Module>(klass: new () => T): T {
        let instance = factory.get(klass.name);
        if (!instance) {
            try {
                instance = new klass();
                factory.set(klass.name, instance);
            } catch (error: unknown) {
                throw new Error(
                    `Error during isomorphic module instanciation. ${klass.name} cannot be instancied.\n${error}`
                );
            }
        }
        return instance as T;
    },
} as const;
