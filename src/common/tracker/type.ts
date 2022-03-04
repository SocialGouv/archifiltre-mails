/* eslint-disable @typescript-eslint/naming-convention */
import type { ExporterType } from "../modules/FileExporterModule";

export interface TrackCoreEventProps {
    "App Closed": { appId: TrackAppId; date: Date };
    // | "App Downloaded"
    "App First Opened": {
        appId: TrackAppId;
        date: Date;
        os: "linux" | "macos" | "win";
    };
    "App Opened": { appId: TrackAppId; date: Date; version: string };
    "App Updated": {
        appId: TrackAppId;
        currentVersion: string;
        oldVersion: string;
    };
    "Export Generated": { appId: TrackAppId; type: ExporterType };
    "NPS Answered": {
        appId: TrackAppId;
        responseId?: string;
        userEmail: string;
    };
    "PST Droped": {
        appId: TrackAppId;
        attachementCount: number;
        loadTime: number;
        mailCount: number;
        size: number;
    };
    // | "Site Viewed"
    "Work Reloaded": { appId: TrackAppId; workHash: TrackWorkHash };
    "Work Saved": { appId: TrackAppId; workHash: TrackWorkHash };
}

export interface TrackAppEventProps {
    "Err(1.0) PST Not Opened": {
        appId: TrackAppId;
        errorId: TrackErrorId;
        message: string;
        pstSize: number;
    };
    "Err(999.0) Error Triggered": {
        appId: TrackAppId;
        errorId: TrackErrorId;
        message: string;
    };
    "Feat(1.0) Delete Folder Selected": { appId: TrackAppId };
    "Feat(2.0) Mailbox Owner Chosen": { appId: TrackAppId };
    "Feat(3.0) Element Traversed": {
        appId: TrackAppId;
        viewType: "correspondant" | "mail" | "year";
    };
    "Feat(4.0) Detail Expanded": { appId: TrackAppId };
    "Feat(5.0) Element Marked": {
        appId: TrackAppId;
        elementSize: number;
        markType: "delete" | "keep";
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
    "PST Droped": "PST",
    "Work Reloaded": "Export",
    "Work Saved": "Export",
};
