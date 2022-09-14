import type {
    PstAttachment,
    PstEmail,
    PstExtractDatas,
} from "@common/modules/pst-extractor/type";
import { v4 as randomUUID } from "uuid";

interface BaseViewerObject<TId extends string> {
    id: TId;
    ids: string[];
    name: string;
    size: number;
    value: string;
}

export type ViewerObjectChild = Omit<BaseViewerObject<string>, "value"> &
    Record<string, BaseViewerObject<string>[keyof BaseViewerObject<string>]>;

export interface DefaultViewerObject<TId extends string = string>
    extends BaseViewerObject<TId> {
    children: ViewerObjectChild[];
}
export interface MailViewerObject<TId extends string>
    extends DefaultViewerObject<TId> {
    email: PstEmail;
}

export type ViewerObject<TId extends string> =
    | DefaultViewerObject
    | MailViewerObject<TId>;

export const isMailViewerObject = <TId extends string>(
    viewerObject: ViewerObject<TId>
): viewerObject is MailViewerObject<TId> =>
    !!(viewerObject as MailViewerObject<TId>).email;

export const createBase = <TId extends string>(
    id: TId
): BaseViewerObject<TId> => ({
    id,
    ids: [],
    name: "root",
    size: 0.0001,
    value: "size",
});

export const getInitialTotalAttachements = (
    attachments: PstExtractDatas["attachments"]
): number => [...attachments.values()].flat().length;

export const getInititalTotalFileSize = (
    attachments: PstExtractDatas["attachments"]
): number => getFileSizeByMail([...attachments.values()].flat());

export const getTotalLevelMail = (elements: ViewerObject<string>): number =>
    elements.children.flat().reduce((acc, curr) => acc + curr.size, 0);

export const getFileSizeByMail = (attachments: PstAttachment[]): number =>
    attachments.reduce((acc: number, { filesize }) => {
        return acc + filesize;
    }, 0);

export const createRootView = (
    recordDatas: Record<string, string[]>
): DefaultViewerObject<"root"> => {
    const children = Object.entries(recordDatas).map(([key, ids]) => {
        return {
            id: randomUUID(),
            ids,
            [key]: ids.length,
            name: key,
            size: ids.length,
        };
    });

    return {
        children,
        ...createBase("root"),
    };
};

export const mapOrderByValues = <TKey, TValue>(
    m: Map<TKey, TValue>,
    compareFn?: (a: TValue, b: TValue) => number
): Map<TKey, TValue> =>
    new Map(
        [...m.entries()].sort(
            compareFn ? ([, va], [, vb]) => compareFn(va, vb) : void 0
        )
    );

export const mapToRecord = <TKey extends string, TValue>(
    m: Map<TKey, TValue>
): Record<TKey, TValue> =>
    [...m.entries()].reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v }),
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        {} as Record<TKey, TValue>
    );

// ### CACHE ###
const mailsCache = new Map<string, unknown>();

const nodesCache = new Map<string, DefaultViewerObject>();

export const createNodes = (
    datas: Map<string, string[]>,
    id: string,
    currentData: DefaultViewerObject
): DefaultViewerObject => {
    let nodeItems = nodesCache.get(id);
    if (nodeItems) return nodeItems;

    const children = [...datas.entries()].map(([name, ids]) => {
        return {
            id: randomUUID(),
            ids,
            name,
            size: ids.length,
            value: ids.length,
        };
    });

    nodeItems = {
        children,
        id,
        ids: children.map((child) => child.id),
        name: currentData.name,
        size: datas.size,
        value: "size",
    };
    try {
        return nodeItems;
    } finally {
        nodesCache.set(id, nodeItems);
    }
};

export const createMails = <TId extends string>(
    mails: PstEmail[],
    id: TId,
    sender: string
): MailViewerObject<TId> => {
    let mailItems = mailsCache.get(id);
    if (mailItems) return mailItems as MailViewerObject<TId>;

    const children = mails.map((value) => {
        const { name, size, ...email } = value;

        return {
            email,
            id: value.id,
            ids: [value.id],
            name,
            size,
            value: name,
        };
    });

    mailItems = {
        children,
        ...createBase(id),
        name: sender,
    };
    try {
        return mailItems as MailViewerObject<TId>;
    } finally {
        mailsCache.set(id, {
            children,
            ...createBase(id),
            name: sender,
        });
    }

    // return mailsCache.get(id) as MailViewerObject<TId>;
};
