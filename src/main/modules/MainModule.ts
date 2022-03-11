import type { Module } from "@common/modules/Module";

export abstract class MainModule implements Module {
    public async uninit(): Promise<void> {
        return Promise.resolve();
    }
    public abstract init(): Promise<void>;
}
