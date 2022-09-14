import type { Module } from "@common/modules/Module";

export abstract class MainModule implements Module {
    public async uninit(): pvoid {
        return Promise.resolve();
    }
    public abstract init(): pvoid;
}
