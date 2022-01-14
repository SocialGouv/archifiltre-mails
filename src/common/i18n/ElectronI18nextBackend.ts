import { IS_MAIN, STATIC_PATH } from "@common/config";
import { ipcMain, ipcRenderer } from "electron";
import fs from "fs/promises";
import type {
    BackendModule,
    InitOptions,
    ReadCallback,
    ResourceKey,
    Services,
} from "i18next";
import path from "path";

import type { Locale, Namespace } from "./raw";

export interface ElectronI18nextBackendOptions {
    debug?: boolean;
}

const I18N_REQUEST_EVENT = "i18n.event.request";

export class ElectronI18nextBackend
    implements BackendModule<ElectronI18nextBackendOptions>
{
    public readonly type = "backend";

    private readonly mainCache = new Map<Locale, Map<Namespace, ResourceKey>>();

    constructor(
        private readonly services: Services,
        private readonly backendOptions: ElectronI18nextBackendOptions,
        private readonly i18nextOptions: InitOptions
    ) {
        this.init();
    }

    init(): void {
        if (IS_MAIN) {
            ipcMain.handle(
                I18N_REQUEST_EVENT,
                async (_evt, language: Locale, namespace: Namespace) =>
                    this.requestFile(language, namespace)
            );
        }
        return;
    }

    read(language: Locale, namespace: Namespace, callback: ReadCallback): void {
        (IS_MAIN
            ? this.requestFile(language, namespace)
            : ipcRenderer.invoke(I18N_REQUEST_EVENT, language, namespace)
        )
            .then((data: ResourceKey) => {
                callback(null, data);
            })
            .catch((err: Error) => {
                callback(err, null);
            });
    }

    private async requestFile(language: Locale, namespace: Namespace) {
        const localesPath = path.resolve(STATIC_PATH, "locales");
        const filePath = path.join(localesPath, `${namespace}.json`);
        const languageCache = this.mainCache.get(language);
        if (!languageCache) {
            const data: ResourceKey = JSON.parse(
                await fs.readFile(filePath, { encoding: "utf-8" })
            );
            this.mainCache.set(language, new Map([[namespace, data]]));
            return data;
        }

        const namespaceCache = languageCache.get(namespace);
        if (!namespaceCache) {
            const data: ResourceKey = JSON.parse(
                await fs.readFile(filePath, { encoding: "utf-8" })
            );
            this.mainCache.get(language)!.set(namespace, data);
            return data;
        }

        return this.mainCache.get(language)!.get(namespace)!;
    }
}
