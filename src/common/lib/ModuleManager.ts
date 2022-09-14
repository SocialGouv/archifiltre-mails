import type { Module } from "../modules/Module";
import { ModuleError } from "../modules/Module";
import { AppError } from "./error/AppError";

/**
 * Load and init the given modules in the current process.
 */
export const loadModules = async (...mods: Module[]): pvoid => {
    await Promise.all(
        mods.map(async (mod) => {
            console.log(`<MODULE_LOADER> ${mod.constructor.name} loading !`);
            await mod.init().catch((error) => {
                throw new ModuleError(
                    `<MODULE_ERROR> ${mod.constructor.name} failed init.`,
                    mod,
                    error
                );
            });
        })
    ).catch((error) => {
        throw new AppError("<APP_ERROR> Cannot load modules.", error);
    });
};
/**
 * Unload and uninit the given modules in the current process.
 */
export const unloadModules = async (...mods: Module[]): pvoid => {
    await Promise.all(
        mods.map(async (mod) => {
            console.warn(
                `<MODULE_UNLOADER> ${mod.constructor.name} unloading !`
            );
            await mod.uninit().catch((error) => {
                throw new ModuleError(
                    `<MODULE_ERROR> ${mod.constructor.name} failed uninit.`,
                    mod,
                    error
                );
            });
        })
    ).catch((error) => {
        throw new AppError("<APP_ERROR> Cannot unload modules.", error);
    });
};
