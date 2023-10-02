import type { Dispatch } from "react";

export type DispatchUpdater<T> = Dispatch<Partial<T>>;
