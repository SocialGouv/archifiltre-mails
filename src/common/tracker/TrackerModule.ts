import type { PubSub } from "../event/PubSub";
import { IsomorphicService } from "../modules/ContainerModule";
import { IsomorphicModule } from "../modules/Module";
import type { UserConfigService } from "../modules/UserConfigModule";
import { DelegatingProvider } from "./provider/DelegatingProvider";
import { NoopProvider } from "./provider/NoopProvider";
import type { TrackerProvider } from "./provider/TrackerProvider";
import type { DelegatingName, ProviderType } from "./provider/utils";
import { providers } from "./provider/utils";

export class TrackerModule extends IsomorphicModule {
    public enableTracking = true;

    public provider?: TrackerProvider;

    constructor(
        private readonly userConfigService: UserConfigService,
        private readonly pubSub: PubSub
    ) {
        super();
    }

    public async init(): Promise<void> {
        await this.userConfigService.wait();
        this.enableTracking = this.userConfigService.get("collectData");

        this.pubSub.subscribe("event.userconfig.updated", (event) => {
            this.enableTracking = event.state.collectData;
            if (this.enableTracking) this.provider?.enable();
            else this.provider?.disable();
        });

        await this.getProvider().init();
    }

    public async uninit(): Promise<void> {
        return Promise.resolve();
    }

    public getProvider(): TrackerProvider {
        if (!this.provider) {
            return (this.provider = this.findProvider(
                process.env.TRACKER_PROVIDER as ProviderType
            ));
        }

        return this.provider;
    }

    private findProvider(name: ProviderType): TrackerProvider {
        const appId = this.userConfigService.get("appId");
        const disabled = !this.enableTracking;
        if (name.startsWith("delegating")) {
            const names = DelegatingProvider.parseQueryString(
                name as DelegatingName
            );

            return new DelegatingProvider(
                appId,
                disabled,
                names.map((n) => this.findProvider(n))
            );
        }
        return new (providers.find((p) => p.trackerName === name) ??
            NoopProvider)(appId, disabled);
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
