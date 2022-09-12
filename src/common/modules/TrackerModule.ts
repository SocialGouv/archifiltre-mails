import type { PubSub } from "../lib/event/PubSub";
import { DelegatingProvider } from "../tracker/provider/DelegatingProvider";
import { NoopProvider } from "../tracker/provider/NoopProvider";
import type { TrackerProvider } from "../tracker/provider/TrackerProvider";
import type { DelegatingName, ProviderType } from "../tracker/provider/utils";
import { providers } from "../tracker/provider/utils";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { UserConfigService } from "./UserConfigModule";

/**
 * This is the main entry point for the tracking system.
 */
export class TrackerModule extends IsomorphicModule {
    public enableTracking = true;

    private provider?: TrackerProvider;

    private readonly userConfigUnsub = this.pubSub.subscribe(
        "event.userconfig.updated",
        (event) => {
            this.enableTracking = event.state.collectData;
            if (this.enableTracking) this.provider?.enable();
            else this.provider?.disable();
        }
    );

    constructor(
        private readonly userConfigService: UserConfigService,
        private readonly pubSub: PubSub
    ) {
        super();
    }

    public async init(): pvoid {
        await this.userConfigService.wait();
        this.enableTracking = this.userConfigService.get("collectData");

        await this.getProvider().init();
    }

    public async uninit(): pvoid {
        this.userConfigUnsub();
        await this.getProvider().uninit();
    }

    /**
     * Return the currently configured provider.
     */
    public getProvider(): TrackerProvider {
        if (!this.provider) {
            return (this.provider = this.findProvider(
                process.env.TRACKER_PROVIDER as ProviderType
            ));
        }

        return this.provider;
    }

    private findProvider(name?: ProviderType): TrackerProvider {
        const appId = this.userConfigService.get("appId");
        const disabled = !this.enableTracking;
        if (name?.startsWith("delegating")) {
            const names = DelegatingProvider.parseQueryString(
                name as DelegatingName
            );

            const foundProviders = (names as ProviderType[]).map((n) =>
                this.findProvider(n)
            );
            return new DelegatingProvider(appId, disabled, foundProviders);
        }
        return new (providers.find((p) => p.trackerName === name) ??
            NoopProvider)(appId, disabled) as TrackerProvider;
    }

    get service(): TrackerService {
        return new TrackerService(this.getProvider.bind(this));
    }
}

export class TrackerService extends IsomorphicService {
    constructor(public readonly getProvider: TrackerModule["getProvider"]) {
        super();
    }
}
