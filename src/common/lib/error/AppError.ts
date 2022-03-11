import { IS_MAIN, IS_PACKAGED } from "../../config";

/**
 * Global error object. Must be the top most error in a stacktrace.
 */
export class AppError extends Error {
    public readonly name = this.constructor.name;

    public readonly isDev = IS_PACKAGED();

    public isMain = IS_MAIN;

    constructor(message: string, public previousError?: Error | unknown) {
        super(message);
    }

    /**
     * Return a full proper stack trace with previous wrapped errors.
     */
    public appErrorStack(): string[] {
        return this.appErrorList().map(
            (e) => e.stack ?? `${e.name} has no stack`
        );
    }

    /**
     * Return all previously wrapped errors.
     */
    public appErrorList(): Error[] {
        const errors: Error[] = [this];
        if (this.previousError) {
            if (this.previousError instanceof AppError) {
                errors.push(...this.previousError.appErrorList());
            } else
                errors.push(
                    this.previousError instanceof Error
                        ? this.previousError
                        : new Error(`${this.previousError}`)
                );
        }

        return errors;
    }
}
