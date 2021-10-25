import { IS_DEV } from "@common/config";
import type { Module } from "@common/modules/Module";
import { session } from "electron";
import { existsSync } from "fs";
import { join } from "path";

/**
 * Module to load wanted extensions to dev tools.
 */
export class DevToolsModule implements Module {
    async init(): Promise<void> {
        const REACT_DEVTOOLS_PATH = join(
            process.cwd(),
            "scripts",
            "out",
            "react-devtools-extension"
        );

        if (IS_DEV) {
            if (existsSync(REACT_DEVTOOLS_PATH))
                await session.defaultSession.loadExtension(
                    REACT_DEVTOOLS_PATH,
                    {
                        allowFileAccess: true,
                    }
                );
        }
    }
}
