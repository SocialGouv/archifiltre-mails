export interface Module {
    init: () => Promise<void>;
}

export abstract class IsomorphicModule implements Module {
    public static readonly ISOMORPHIC = true;

    public readonly ISOMORPHIC = true;

    public abstract init(): Promise<void>;
}

const factory = new Map<string, IsomorphicModule>();
export const IsomorphicModuleFactory = {
    // eslint-disable-next-line prettier/prettier -- Because colors are messed up when multilined
    getInstance<TClass extends typeof IsomorphicModule, T extends InstanceType<TClass>>(klass: TClass): T {
        let instance = factory.get(klass.name);
        if (!instance) {
            try {
                instance = Reflect.construct(klass, []);
                if (!instance) {
                    throw new Error(
                        `${klass.name} instanciation returned nothing.`
                    );
                }
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
