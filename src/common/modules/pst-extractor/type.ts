export interface ExtractOptions {
    pstFilePath: string;
    depth?: number;
    noProgress?: boolean;
}

export type PstElementType =
    | "attachement"
    | "calendar"
    | "contact"
    | "email"
    | "folder"
    | "rootFolder";

export interface PstElement {
    type: PstElementType;
    children?: PstElement[];
    other?: unknown[];
    size: number;
    name: string;
    id: string;
}

export interface PstFolder extends PstElement {
    type: "folder" | "rootFolder";
    emailCount: number;
    folderType: string;
}

export interface PstContent extends PstFolder {
    type: "rootFolder";
    children: PstFolder[];
}

export interface PstContact extends PstElement {
    type: "contact";
    name: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface PstEmailRecipient {
    name: string;
    email?: string;
}

export interface PstEmail extends PstElement {
    type: "email";
    attachements: PstAttachement[];
    size: 1;
    sentTime: Date | null;
    receivedDate: Date | null;
    from: PstEmailRecipient;
    to: PstEmailRecipient[];
    cc: PstEmailRecipient[];
    bcc: PstEmailRecipient[];
    subject: string;
    contentText: string;
    contentHTML: string;
    contentRTF: string;
    attachementCount: number;
}

export interface PstAttachement {
    mimeType: string;
    filename: string;
    filesize: number;
}

/**
 * State object on each progress tick (one tick per extracted email).
 */
export interface PstProgressState {
    progress: boolean;
    countTotal: number;
    countEmail: number;
    countFolder: number;
    countAttachement: number;
    elapsed: number;
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
