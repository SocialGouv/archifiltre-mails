import { Trait } from "@lsagetlethias/tstrait";

export interface Waitable {
    /**
     * Consider an object as resolved wich means that all "wait" promises will be resolved.
     */
    resolve: () => void;
    /**
     * Wait for an object to be resolved. Usefull when service dependencies are called during boot time, at the same moment of their init.
     */
    wait: () => Promise<void>;
}

/**
 * Trait used to decore any object that need to be resolved before used.
 *
 * Typical case is when multiple asyncable objects are instanciated and have dependencies between them.
 */
export class WaitableTrait extends Trait implements Waitable {
    private resolved = false;

    private resolveCallbacks?: (() => void)[];

    public resolve(): void {
        this.resolved = true;
        this.resolveCallbacks?.forEach((cb) => {
            cb();
        });
    }

    public async wait(): Promise<void> {
        if (!this.resolved) {
            return new Promise<void>((resolve) => {
                if (!this.resolveCallbacks) {
                    this.resolveCallbacks = [];
                }
                this.resolveCallbacks.push(resolve);
            });
        }
    }
}
