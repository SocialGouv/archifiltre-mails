import { useEffect, useState } from "react";

import type { UnknownMapping } from "../../utils/type";
import type {
    ReturnServiceType,
    Service,
    ServiceConfigName,
    ServiceConfigType,
    ServiceKeys,
    ServicesConfig,
} from "./container/type";
import { IsomorphicModule } from "./Module";

export abstract class IsomorphicService implements Service {
    public static readonly ISOMORPHIC = true;

    public readonly ISOMORPHIC = true;

    abstract name: string;

    abstract init(): Promise<void>;
}

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

class ContainerModule extends IsomorphicModule {
    private inited = false;

    public async init(): Promise<void> {
        await Promise.all(
            [...isomorphicServiceMap.values(), ...serviceMap.values()]
                .map((service) => {
                    if (isService(service)) {
                        return service.init;
                    }
                })
                .filter((promise) => promise)
        );
        this.inited = true;
    }

    public registerService<T extends ServiceKeys | UnknownMapping>(
        name: ServiceConfigName<T>,
        service?: ServiceConfigType<T>
    ): this {
        if (this.inited) {
            throw new Error(
                "Cannot register a service when the container is already inited."
            );
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

    public registerServices<TNames extends (ServiceKeys | UnknownMapping)[]>(
        ...services: ServicesConfig<TNames>
    ) {
        for (const [name, service] of services) {
            this.registerService(name, service);
        }
    }

    public get<T extends ServiceKeys | UnknownMapping>(
        name: ServiceKeys | T
    ): T extends ServiceKeys ? ReturnServiceType<T> : unknown {
        return (isomorphicServiceMap.get(name) ??
            serviceMap.get(name)) as never;
    }
}

export const containerModule = new ContainerModule();

export const useService = <T extends ServiceKeys | UnknownMapping>(
    name: ServiceKeys | T
): (T extends ServiceKeys ? ReturnServiceType<T> : unknown) | undefined => {
    const [service, setService] =
        useState<T extends ServiceKeys ? ReturnServiceType<T> : unknown>();

    useEffect(() => {
        return () => {
            setService(containerModule.get(name));
        };
    });

    console.log("SERVICE", service);

    return service;
};
