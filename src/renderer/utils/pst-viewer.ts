import type { ComputedDatum } from "@nivo/circle-packing";

import type { PstComputed, PstComputedChild } from "./pst-extractor";
import { isToDeleteFolder, isToKeepFolder } from "./pst-extractor";

export const getChildrenToDeleteIds = (
    children: PstComputedChild[],
    markedToKeepIds: string[]
): string[] =>
    children
        .filter(
            (child: PstComputedChild) =>
                !isToKeepFolder(child.id, markedToKeepIds)
        )
        .map((child) => child.id);

export const getChildrenToKeepIds = (
    children: PstComputedChild[],
    markedToDeleteIds: string[]
): string[] =>
    children
        .filter(
            (child: PstComputedChild) =>
                !isToDeleteFolder(child.id, markedToDeleteIds)
        )
        .map((child) => child.id);

export const getUntagChildrenIds = (
    children: PstComputedChild[],
    markedToDeleteIds: string[],
    markedToKeepIds: string[]
): string[] =>
    children
        .filter(
            (child: PstComputedChild) =>
                !isToDeleteFolder(child.id, markedToDeleteIds) &&
                !isToKeepFolder(child.id, markedToKeepIds)
        )
        .map((child) => child.id);

export const getColorFromTrimester = (
    node: Omit<ComputedDatum<PstComputed>, "color" | "fill">
): number => {
    const month = node.data.email.receivedDate.getMonth();
    console.log(month);

    return month <= 3 ? 0.45 : month <= 6 ? 0.65 : month <= 9 ? 0.85 : 1;
};
