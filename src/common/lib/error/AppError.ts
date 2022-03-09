import { IS_MAIN, IS_PACKAGED } from "../../config";

export class AppError extends Error {
    public readonly name = this.constructor.name;

    public readonly isDev = IS_PACKAGED();

    public isMain = IS_MAIN;

    constructor(message: string, public previousError?: Error | unknown) {
        super(message);
    }

    public appErrorStack(): string[] {
        return this.appErrorList().map(
            (e) => e.stack ?? `${e.name} has not stack`
        );
    }

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
