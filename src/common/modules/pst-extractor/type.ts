export interface ExtractOptions {
    depth?: number;
    noProgress?: boolean;
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
    id: string;
    name: string;
    other?: unknown[];
    size: number;
    type: PstElementType;
}

export interface PstFolder extends PstElement {
    emailCount: number;
    folderType: string;
    type: "folder" | "rootFolder";
}

export const isPstFolder = (elt: PstElement): elt is PstFolder => {
    return elt.type === "folder" || elt.type === "rootFolder";
};

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
    attachementCount: number;
    attachements: PstAttachement[];
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
    to: PstEmailRecipient[];
    type: "email";
}

export const isPstEmail = (elt: PstElement): elt is PstEmail => {
    return elt.type === "email";
};

export interface PstAttachement {
    filename: string;
    filesize: number;
    mimeType: string;
}

/**
 * State object on each progress tick (one tick per extracted email).
 */
export interface PstProgressState {
    countAttachement: number;
    countEmail: number;
    countFolder: number;
    countTotal: number;
    elapsed: number;
    progress: boolean;
}

/**
 * Computed primary infos extracted from a PST file.
 */
export interface PstExtractTables {
    /**
     * Attachement list stored by email uuid
     */
    attachements: Map<string, PstAttachement[]>;
    /**
     * Contact list associated with list of corresponding email uuid
     */
    contacts: Map<string, string[]>;
    /**
     * Email list stored by folder uuid
     */
    emails: Map<string, PstEmail[]>;
}
