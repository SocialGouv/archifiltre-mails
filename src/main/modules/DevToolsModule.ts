import { IS_DEV } from "@common/config";
import { session } from "electron";
import { existsSync } from "fs";
import { join } from "path";

import { MainModule } from "./MainModule";

/**
 * Module to load wanted extensions to dev tools.
 */
export class DevToolsModule extends MainModule {
    public async init(): pvoid {
        if (IS_DEV) {
            const REACT_DEVTOOLS_PATH = join(
                process.cwd(),
                "scripts",
                "out",
                "react-devtools-extension"
            );
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
