import { AppError } from "../lib/error/AppError";

/**
 * A module is self contained group of capabilities that can refer to a business domain.
 *
 * It also can have a purely technical meaning.
 *
 * It will be loaded and inited at the begining of the current process.
 */
export interface Module {
    /**
     * Init a module once when the app starts (main) or when a window open (renderer).
     *
     * If needed, a private `inited` property flag can be used to ensure this method is called once.
     */
    init: () => Promise<void>;

    /**
     * Uninit a module once when the app close (main) or when a window closes (renderer).
     */
    uninit: () => Promise<void>;
}

/**
 * An isomorphic module can be loaded both in main AND renderer processes.
 *
 * It's recommended to be singleton-ed per process ; therefore, the constructor must stay uncalled and without parameters.
 */
export abstract class IsomorphicModule implements Module {
    /**
     * Static identifier to recognize a module as isomorphic
     */
    public static readonly ISOMORPHIC = true;

    /**
     * Instance identifier to recognize a module as isomorphic
     */
    public readonly ISOMORPHIC = true;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function -- abstract constructor signature
    constructor(..._args: unknown[]) {}
    public abstract init(): Promise<void>;
    public abstract uninit(): Promise<void>;
}

const factory = new Map<string, IsomorphicModule>();
/**
 * Factory to ensure creation of single instance of module per process
 */
export const IsomorphicModuleFactory = {
    /**
     * Get a single instance of an isomorphic module.
     *
     * @param klass An isomorphic module class
     * @returns The single instance of the given class
     */
    // eslint-disable-next-line prettier/prettier -- Because colors are messed up when multilined
    getInstance<TClass extends typeof IsomorphicModule, T extends InstanceType<TClass>>(klass: TClass, ...deps: ConstructorParameters<TClass>): T {
        let instance = factory.get(klass.name);
        if (!instance) {
            try {
                instance = Reflect.construct(klass, deps);
                if (!instance) {
                    throw new ModuleError(
                        `${klass.name} instanciation returned nothing.`,
                        void 0
                    );
                }
                factory.set(klass.name, instance);
            } catch (error: unknown) {
                throw new ModuleError(
                    `Error during isomorphic module instanciation. ${klass.name} cannot be instancied.`,
                    void 0,
                    error
                );
            }
        }
        return instance as T;
    },
} as const;

export class ModuleError extends AppError {
    constructor(
        message: string,
        public readonly mod?: Module,
        previousError?: Error | unknown
    ) {
        super(message, previousError);
    }
}
