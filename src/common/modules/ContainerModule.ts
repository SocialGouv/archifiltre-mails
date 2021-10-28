import { IS_DEV } from "@common/config";
import { useEffect, useState } from "react";

import type { UnknownMapping } from "../utils/type";
import type {
    ReturnServiceType,
    Service,
    ServiceConfigName,
    ServiceConfigType,
    ServiceKeys,
    ServicesConfig,
    // eslint-disable-next-line unused-imports/no-unused-imports -- Used in doc
    ServicesKeyType,
} from "./container/type";
import { IsomorphicModule } from "./Module";

/**
 * An isomorphic service can be loaded both in main AND rederer processes.
 */
export abstract class IsomorphicService implements Service {
    /**
     * Static identifier to recognize a service as isomorphic
     */
    public static readonly ISOMORPHIC = true;

    /**
     * Instance identifier to recognize a service as isomorphic
     */
    public readonly ISOMORPHIC = true;

    public readonly name = this.constructor.name;

    abstract init?(): Promise<void>;
}

/**
 * Guard against a value not being a `Service`
 *
 * @param service Supposed service
 * @returns true if `service` is a {@link Service}
 */
export const isService = (service: unknown): service is Service => {
    const suppose = service as Service;
    return (
        "name" in suppose &&
        "init" in suppose &&
        typeof suppose.init === "function"
    );
};

const isomorphicServiceMap = new Map<string, unknown>();
const serviceMap = new Map<string, unknown>();

/**
 * Isomorphic module responsible of storing and loading services for the entire application.
 *
 * A "main" container can be different from a "renderer" container as they will not need the same services. (e.g. DevTools)
 * but they need to both load an isomorphic service for it to works.
 */
class ContainerModule extends IsomorphicModule {
    private inited = false;

    public async init(): Promise<void> {
        if (this.inited && !IS_DEV) {
            throw new Error("ContainerModule has already been inited.");
        }

        await Promise.all(
            [...isomorphicServiceMap.values(), ...serviceMap.values()]
                .map((service) => {
                    console.log(
                        `[ContainerModule] ${
                            (service as Service).constructor.name
                        } loading !`
                    );
                    if (isService(service)) {
                        return service.init?.();
                    }
                })
                .filter((promise) => promise)
        );
        this.inited = true;
    }

    /**
     * Register a single service to be loaded.
     *
     * This method cannot be called once the module is inited.
     *
     * @param name The service name/id
     * @param service The service to register or undefined/null to delete it
     * @returns Chain {@link ContainerModule}
     */
    public registerService<T extends ServiceKeys | UnknownMapping>(
        name: ServiceConfigName<T>,
        service?: ServiceConfigType<T>
    ): this {
        if (this.inited) {
            if (IS_DEV) {
                isomorphicServiceMap.clear();
                serviceMap.clear();
            } else {
                throw new Error(
                    "Cannot register a service when the container is already inited."
                );
            }
        }
        if (service) {
            if (service instanceof IsomorphicService) {
                isomorphicServiceMap.set(name, service);
            } else serviceMap.set(name, service);
        } else {
            serviceMap.delete(name);
            isomorphicServiceMap.delete(name);
        }

        return this;
    }

    /**
     * Register multiple services at once.
     *
     * @param services An array of tuple [name/id, service]
     * @returns Chain {@link ContainerModule}
     * @see {@link registerService}
     */
    public registerServices<TNames extends (ServiceKeys | UnknownMapping)[]>(
        ...services: ServicesConfig<TNames>
    ): this {
        for (const [name, service] of services) {
            this.registerService(name, service);
        }

        return this;
    }

    /**
     * Get a service by its declared name.
     *
     * For autocomplete and typing purposes, the service can be declared in {@link ServicesKeyType}.
     *
     * @param name The service name/id
     * @returns The wanted service
     *
     */
    public get<T extends ServiceKeys | UnknownMapping>(
        name: ServiceKeys | T
    ): T extends ServiceKeys ? ReturnServiceType<T> : unknown {
        return (isomorphicServiceMap.get(name) ??
            serviceMap.get(name)) as never;
    }
}

/**
 * The {@link ContainerModule} single instance per process.
 */
export const containerModule = new ContainerModule();

/**
 * React hook to get a service from container.
 *
 * @param name The service name/id
 * @returns The wanted service
 *
 * @todo evolve when async service are needed
 */
export const useService = <T extends ServiceKeys | UnknownMapping>(
    name: ServiceKeys | T
): (T extends ServiceKeys ? ReturnServiceType<T> : unknown) | undefined => {
    const [service, setService] =
        useState<T extends ServiceKeys ? ReturnServiceType<T> : unknown>();

    useEffect(() => {
        setService(containerModule.get(name));
    });

    return service;
};
