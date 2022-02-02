import type { ViewerObjectChild } from "./pst-extractor";

export const getPstComputeChildrenId = (
    children: ViewerObjectChild[]
): string[] => children.map((child) => child.id);
