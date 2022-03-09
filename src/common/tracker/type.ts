/* eslint-disable @typescript-eslint/naming-convention */
import type { ExporterType } from "../modules/FileExporterModule";

export interface TrackCoreEventProps {
    "App Closed": { date: Date };
    // | "App Downloaded"
    "App First Opened": {
        arch: string;
        date: Date;
        os: NodeJS.Platform;
        version: string;
    };
    "App Opened": { date: Date; version: string };
    "App Updated": {
        currentVersion: string;
        oldVersion: string;
    };
    "Export Generated": { size: number; sizeRaw: number; type: ExporterType };
    "NPS Answered": {
        responseId?: string;
        userEmail: string;
    };
    "PST Dropped": {
        attachmentCount: number;
        loadTime: number;
        mailCount: number;
        size: number;
        sizeRaw: number;
    };
    // | "Site Viewed"
    "Work Reloaded": { workHash: TrackWorkHash };
    "Work Saved": { workHash: TrackWorkHash };
}

export interface TrackAppEventProps {
    "Err(1.0) PST Not Opened": {
        errorId: TrackErrorId;
        message: string;
        pstSize: number;
    };
    "Err(999.0) Error Triggered": {
        errorId: TrackErrorId;
        message: string;
    };
    "Feat(1.0) Delete Folder Selected": never;
    "Feat(2.0) Mailbox Owner Chosen": never;
    "Feat(3.0) Element Traversed": {
        viewType: "correspondants" | "mails" | "year";
    };
    "Feat(4.0) Detail Expanded": never;
    "Feat(5.0) Element Marked": {
        markType: "delete" | "keep";
        size: number;
        sizeRaw: number;
    };
}

export type TrackEventCategory =
    | "Action"
    | "App"
    | "Dataviz"
    | "Export"
    | "NPS"
    | "PST"
    | "Site";

export type TrackAppId = string & { readonly _trackAppId?: never };
// TODO: move when "save work" feature is done
export type TrackWorkHash = string & { readonly _trackWorkHash?: never };
// TODO: move when "sentry" feature is done
export type TrackErrorId = string & { readonly _trackErrorId?: never };
export type TrackEventProps = TrackAppEventProps & TrackCoreEventProps;
export type TrackEvent = keyof TrackEventProps;

export const eventCategoryMap: Record<TrackEvent, TrackEventCategory> = {
    "App Closed": "App",
    "App First Opened": "App",
    "App Opened": "App",
    "App Updated": "App",
    "Err(1.0) PST Not Opened": "PST",
    "Err(999.0) Error Triggered": "App",
    "Export Generated": "Export",
    "Feat(1.0) Delete Folder Selected": "Dataviz",
    "Feat(2.0) Mailbox Owner Chosen": "PST",
    "Feat(3.0) Element Traversed": "Dataviz",
    "Feat(4.0) Detail Expanded": "Dataviz",
    "Feat(5.0) Element Marked": "Action",
    "NPS Answered": "NPS",
    "PST Dropped": "PST",
    "Work Reloaded": "Export",
    "Work Saved": "Export",
};
