import type { PstContent } from "@common/modules/pst-extractor/type";
import { Object } from "@common/utils/overload";
import type {
    CirclePackingSvgProps,
    ComputedDatum,
} from "@nivo/circle-packing";

import type { MainInfos } from "../store/PstFMInfosStore";
import { COLORS, MONTHS_NB } from "./constants";
import type {
    DefaultViewerObject,
    MailViewerObject,
    ViewerObjectChild,
} from "./dashboard-viewer-dym";
import { isMailViewerObject } from "./dashboard-viewer-dym";

type ResponsiveCirclePackingProps<TRawDatum> = Partial<
    Omit<CirclePackingSvgProps<TRawDatum>, "data" | "height" | "width">
> &
    Pick<CirclePackingSvgProps<TRawDatum>, "data">;

export type CirclePackingCommonProps = Partial<
    ResponsiveCirclePackingProps<DefaultViewerObject>
> & {
    id: keyof PstContent;
    value: keyof PstContent;
};

export type TagType = "delete" | "keep" | "untag";

const opacities = {
    [MONTHS_NB.MARCH]: 0.45,
    [MONTHS_NB.JUNE]: 0.65,
    [MONTHS_NB.SEPT]: 0.85,
};
const DEFAULT_OPACITY = 1;
export const getColorFromTrimester = (
    node: Omit<ComputedDatum<MailViewerObject<string>>, "color" | "fill">
): number => {
    const month = node.data.email.receivedDate?.getMonth() ?? 1; // January

    const opacityMonthKey = Object.keys(opacities).find(
        (monthOpa) => month <= monthOpa
    );
    return opacityMonthKey ? opacities[opacityMonthKey] : DEFAULT_OPACITY;
};

export const getTagColor = (
    node: Omit<ComputedDatum<MailViewerObject<string>>, "color" | "fill">,
    tag: TagType
): string => {
    if (tag === "delete") {
        return `rgba(247, 94, 66, ${getColorFromTrimester(node)})`;
    }

    if (tag === "keep") {
        return `rgba(98, 188, 111, ${getColorFromTrimester(node)})`;
    }

    // untag
    return `rgba(31, 120, 180, ${getColorFromTrimester(node)})`;
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
    node: ComputedDatum<DefaultViewerObject>,
    mainInfos: MainInfos | undefined,
    isInfoFocus: boolean,
    ownerId: string
): string => {
    if (mainInfos && isInfoFocus && node.data.id === mainInfos.id)
        return COLORS.BLACK;
    else if (
        isMailViewerObject(node.data) &&
        ownerId === node.data.email.from.email
    )
        return COLORS.MAIL_FROM_ME;
    return COLORS.TRANSPARENT;
};

/**
 * Utility function to get total count per level for the given object per level
 * (Total count of mails, attachment...).
 */
export const getTotalCount = (viewObject: ViewerObjectChild[]): number =>
    viewObject.reduce((acc, curr) => acc + curr.size, 0);
