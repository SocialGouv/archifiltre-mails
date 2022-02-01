import type { PstContent } from "@common/modules/pst-extractor/type";
import type {
    CirclePackingSvgProps,
    ComputedDatum,
} from "@nivo/circle-packing";

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

    return month <= 3 ? 0.45 : month <= 6 ? 0.65 : month <= 9 ? 0.85 : 1;
};

////////////
// Redeclare because ResponsiveCirclePackingProps is not exported.
type ResponsiveCirclePackingProps<TRawDatum> = Partial<
    Omit<CirclePackingSvgProps<TRawDatum>, "data" | "height" | "width">
> &
    Pick<CirclePackingSvgProps<TRawDatum>, "data">;

type CirclePackingCommonProps = Partial<
    ResponsiveCirclePackingProps<PstComputed>
> & {
    id: keyof PstContent;
    value: keyof PstContent;
};

export const commonProperties: CirclePackingCommonProps = {
    enableLabels: true,
    id: "id",
    isInteractive: true,
    label: (node) =>
        node.data.email
            ? `${node.data.email.receivedDate.getDay()}-${node.data.email.receivedDate.getMonth()}-${node.data.email.receivedDate.getFullYear()}`
            : node.data.name,
    labelsFilter: (label) => label.node.height === 0,
    labelsSkipRadius: 16,
    motionConfig: "slow",
    padding: 2,
    value: "size",
};

export const sanitizeMailDate = (date: Date): string =>
    JSON.stringify(date)
        .replace("T", " ")
        .replace("Z", " ")
        .replaceAll('"', "");
