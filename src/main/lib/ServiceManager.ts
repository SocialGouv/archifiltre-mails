import type { Module } from "../../common/core/modules/Module";

export const loadModules = async (...modules: Module[]): Promise<void> => {
    await Promise.all(modules.map((module) => module.init)).catch((error) => {
        console.error(`<APP_ERROR> Cannot load modules.\n${error}`);
    });
};
