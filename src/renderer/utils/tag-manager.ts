import type { ComputedDatum } from "@nivo/circle-packing";

import type { ViewerObject, ViewerObjectChild } from "./dashboard-viewer-dym";

export const getPstComputeChildrenId = (
    children: ViewerObjectChild[]
): string[] => children.map((child) => child.id);

export const getChildrenToDeleteIds = (
    children: ViewerObjectChild[],
    markedToKeepIds: string[]
): string[] =>
    children
        .filter(
            (child: ViewerObjectChild) =>
                !isToKeepFolder(child.id, markedToKeepIds)
        )
        .map((child) => child.id);

export const getChildrenToKeepIds = (
    children: ViewerObjectChild[],
    markedToDeleteIds: string[]
): string[] =>
    children
        .filter(
            (child: ViewerObjectChild) =>
                !isToDeleteFolder(child.id, markedToDeleteIds)
        )
        .map((child) => child.id);

export const getUntagChildrenIds = (
    children: ViewerObjectChild[],
    markedToDeleteIds: string[],
    markedToKeepIds: string[]
): string[] =>
    children
        .filter(
            (child: ViewerObjectChild) =>
                !isToDeleteFolder(child.id, markedToDeleteIds) &&
                !isToKeepFolder(child.id, markedToKeepIds)
        )
        .map((child) => child.id);

export const isToDeleteFolder = (id: string, deleteIds: string[]): boolean =>
    deleteIds.includes(id);

export const isToKeepFolder = (id: string, keepIds: string[]): boolean =>
    keepIds.includes(id);

/**
 * @param verifyIds could be current deleteIds / keepIds
 * @param verifyIds node element
 */
export const isNodeContainsIds = (
    verifyIds: string[],
    nodeIds: Omit<
        ComputedDatum<ViewerObject<string>>,
        "color" | "fill"
    >["data"]["ids"]
): boolean =>
    verifyIds.some((element) => {
        return nodeIds.includes(element);
    });
