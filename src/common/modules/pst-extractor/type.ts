export interface PstContent {
    name: string;
    size?: number;
    contentSize?: number;
    children?: PstContent[];
}

export interface PSTExtractorEmail {
    senderName: string;
    subject: string;
}
