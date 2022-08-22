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
    contentHTML: string;
    contentRTF: string;
    contentText: string;
    from: PstEmailRecipient;
    isFromMe: boolean;
    receivedDate: Date | null;
    sentTime: Date | null;
    size: 1;
    subject: string;
    tag?: string;
    to: PstEmailRecipient[];
    type: "email";
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

/**
 * Computed primary infos extracted from a PST file.
 * @deprecated
 */
export interface PstExtractTables {
    /**
     * Attachement list stored by email uuid
     */
    attachements: Map<string, PstAttachment[]>;
    /**
     * Contact list associated with list of corresponding email uuid
     */
    contacts: Map<string, string[]>;
    /**
     * Email list stored by folder uuid
     */
    emails: Map<string, PstEmail[]>;
}

export interface AdditionalDatas {
    contactList: AddtionalDataItem[];
    deleted: string[];
    extremeDates: ExtremeDates;
    folderList: AddtionalDataItem[];
    /**
     * @deprecated
     * @todo Pre discover pst owner
     */
    possibleOwner?: Required<PstEmailRecipient>;
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
