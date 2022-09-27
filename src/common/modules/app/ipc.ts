import type { UpdateInfo } from "electron-updater";

import type { DualIpcConfig } from "../../lib/ipc/event";

export type AutoUpdateCheckIpcConfig =
    | DualIpcConfig<
          "autoUpdate.onUpdateAvailable",
          [],
          [info: UpdateInfo | false]
      >
    | DualIpcConfig<"autoUpdate.onError", [], [error: string]>;

declare module "../../lib/ipc/event" {
    interface SyncIpcMapping {
        "autoUpdate.doUpdate": IpcConfig<[], boolean>;
    }

    interface DualAsyncIpcMapping {
        "autoUpdate.check": AutoUpdateCheckIpcConfig;
    }
}

export {};
