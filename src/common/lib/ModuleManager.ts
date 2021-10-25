import type { Module } from "../modules/Module";

/**
 * Load and init the given modules in the current process
 *
 * @param mods Given modules
 */
export const loadModules = async (...mods: Module[]): Promise<void> => {
    await Promise.all(
        mods.map(async (mod) => {
            await mod.init().catch((error) => {
                throw new Error(
                    `<MODULE_ERROR> ${mod.constructor.name} failed init.\n${error}`
                );
            });
        })
    ).catch((error) => {
        console.error(`<APP_ERROR> Cannot load modules.\n${error}`);
        throw error;
    });
};
