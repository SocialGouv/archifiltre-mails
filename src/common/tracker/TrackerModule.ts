import type { PubSub } from "../event/PubSub";
import { IsomorphicService } from "../modules/ContainerModule";
import { IsomorphicModule } from "../modules/Module";
import type { UserConfigService } from "../modules/UserConfigModule";
import { DebugProvider } from "./provider/DebugProvider";
import { MatomoProvider } from "./provider/MatomoProvider";
import { NoopProvider } from "./provider/NoopProvider";
import { PosthogProvider } from "./provider/PosthogProvider";
import type { TrackerProvider } from "./provider/TrackerProvider";

const providers = [
    MatomoProvider,
    PosthogProvider,
    NoopProvider,
    DebugProvider,
] as const;

type ProviderType = typeof providers[number]["trackerName"];

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
    }

    public async uninit(): Promise<void> {
        return Promise.resolve();
    }

    public getProvider(name?: ProviderType): TrackerProvider {
        if (!this.provider) {
            return (this.provider = this.findProvider());
        }

        if (
            (this.provider.constructor as typeof TrackerProvider)
                .trackerName !== process.env.TRACKER_PROVIDER
        ) {
            return this.findProvider();
        }

        return this.provider;
    }

    private findProvider(name = process.env.TRACKER_PROVIDER as ProviderType) {
        return new (providers.find((p) => p.trackerName === name) ??
            NoopProvider)(
            this.userConfigService.get("appId"),
            this.enableTracking
        );
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
