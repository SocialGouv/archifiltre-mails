import type { ViewType } from "../views/setup";

export interface ExtractOptions {
    pstFilePath: string;
}

export type PstElementType =
    | "attachement"
    | "calendar"
    | "contact"
    | "email"
    | "folder"
    | "rootFolder";

export interface PstElement {
    children?: PstElement[];
    elementPath: string;
    id: string;
    name: string;
    other?: unknown[];
    size: number;
    type: PstElementType;
}

export interface AddtionalDataItem {
    id: string;
    name: string;
}

export interface ExtremeDates {
    max: number;
    min: number;
}

export interface PstFolder extends PstElement {
    emailCount: number;
    type: "folder" | "rootFolder";
}

export const isPstFolder = (elt: PstElement): elt is PstFolder => {
    return elt.type === "folder" || elt.type === "rootFolder";
};

export type PstMailIndex = number[];
export type PstMailIndexEntries = [string, PstMailIndex][];
export type PstMailIdsEntries = [string, string[]][];
export type PstAttachmentEntries = [string, PstAttachment[]][];

export interface PstAttachementIndex {
    index: number;
    mailIndex: PstMailIndex;
}

export interface PstContent extends PstFolder {
    children: PstFolder[];
    type: "rootFolder";
}

export interface PstContact extends PstElement {
    email: string;
    firstname: string;
    lastname: string;
    name: string;
    type: "contact";
}

export interface PstEmailRecipient {
    email?: string;
    name: string;
}

export interface PstEmail extends PstElement {
    attachmentCount: number;
    attachments: PstAttachment[];
    bcc: PstEmailRecipient[];
    cc: PstEmailRecipient[];
    contentHTML?: string;
    contentRTF?: string;
    contentText: string;
    from: PstEmailRecipient;
    isFromMe: boolean;
    messageId: string;
    receivedTime: number;
    sentTime: number;
    size: 1;
    subject: string;
    to: PstEmailRecipient[];
    transportMessageHeaders: string;
    type: "email";
}

export interface PstEmailWithTag extends PstEmail {
    tag: string;
}

export const isPstEmail = (elt: PstElement): elt is PstEmail => {
    return elt.type === "email";
};

export interface PstAttachment {
    filename: string;
    filesize: number;
    mimeType: string;
}

/**
 * State object on each progress tick (one tick per extracted email).
 */
export interface PstProgressState {
    countAttachment: number;
    countEmail: number;
    countFolder: number;
    countTotal: number;
    elapsed: number;
    progress: boolean;
}

export interface PstShallowFolder {
    elementPath: string;
    hasSubfolders: boolean;
    id: string;
    mails: string[];
    name: string;
    subfolders: PstShallowFolder[];
}

export interface AdditionalDatas {
    contactList: AddtionalDataItem[];
    deleted: string[];
    extremeDates: ExtremeDates;
    folderList: AddtionalDataItem[];
    folderStructure: PstShallowFolder;
    /**
     * @deprecated
     * @todo Pre discover pst owner
     */
    possibleOwner?: Required<PstEmailRecipient>;
    pstFilename: string;
    received: string[];
    sent: string[];
}

export type GroupType = ViewType | "folder" | "senderMail";

export interface PstExtractDatas {
    additionalDatas: AdditionalDatas;
    attachments: Map<string, PstAttachment[]>;
    groups: Record<GroupType, Map<string, string[]>>;
    indexes: Map<string, PstMailIndex>;
}
