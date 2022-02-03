import type { PstContent } from "@common/modules/pst-extractor/type";
import type {
    CirclePackingSvgProps,
    ComputedDatum,
} from "@nivo/circle-packing";

import type { MainInfos } from "../store/PSTStore";
import { COLORS } from "./constants";
import type {
    DefaultViewerObject,
    MailViewerObject,
    ViewerObjectChild,
} from "./pst-extractor";
import {
    isMailViewerObject,
    isToDeleteFolder,
    isToKeepFolder,
} from "./pst-extractor";

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

export const getColorFromTrimester = (
    node: Omit<ComputedDatum<MailViewerObject<string>>, "color" | "fill">
): number => {
    const month = node.data.email.receivedDate?.getMonth() ?? 1; // January

    return month <= 3 ? 0.45 : month <= 6 ? 0.65 : month <= 9 ? 0.85 : 1; // TODO: magic number
};

////////////
// Redeclare because ResponsiveCirclePackingProps is not exported.
type ResponsiveCirclePackingProps<TRawDatum> = Partial<
    Omit<CirclePackingSvgProps<TRawDatum>, "data" | "height" | "width">
> &
    Pick<CirclePackingSvgProps<TRawDatum>, "data">;

export type CirclePackingCommonProps = Partial<
    ResponsiveCirclePackingProps<DefaultViewerObject<string>>
> & {
    id: keyof PstContent;
    value: keyof PstContent;
};

export const commonProperties: CirclePackingCommonProps = {
    borderWidth: 3,
    enableLabels: true,
    id: "id",
    isInteractive: true,
    label: (node) =>
        isMailViewerObject(node.data)
            ? `${node.data.email.receivedDate?.getDay()}-${node.data.email.receivedDate?.getMonth()}-${node.data.email.receivedDate?.getFullYear()}`
            : node.data.name,
    labelsFilter: (label) => label.node.height === 0,
    labelsSkipRadius: 16,
    motionConfig: "slow",
    padding: 2,
    value: "size",
};

// TODO: Intl.DateTimeFormat() in combinaison with i18n module
export const sanitizeMailDate = (date: Date): string =>
    JSON.stringify(date)
        .replace("T", " ")
        .replace("Z", " ")
        .replaceAll('"', "");

export const handleFocusItemBorderColor = (
    node: ComputedDatum<DefaultViewerObject<string>>,
    mainInfos: MainInfos | undefined,
    isInfoFocus: boolean
): string => {
    if (mainInfos && isInfoFocus && node.data.id === mainInfos.id)
        return COLORS.BLACK;
    return COLORS.TRANSPARENT;
};
