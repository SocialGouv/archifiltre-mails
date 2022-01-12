import type { PstComputedChild } from "./pst-extractor";

export const getPstComputeChildrenId = (
    children: PstComputedChild[]
): string[] => children.map((child) => child.id);
