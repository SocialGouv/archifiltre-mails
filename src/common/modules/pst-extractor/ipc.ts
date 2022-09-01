import type {
    ExtractOptions,
    PstEmail,
    PstExtractDatas,
    PstMailIndex,
    PstProgressState,
} from "./type";

declare module "../../lib/ipc/event" {
    interface AsyncIpcMapping {
        "pstExtractor.event.extract": IpcConfig<
            [options: ExtractOptions],
            PstExtractDatas
        >;
        "pstExtractor.event.getEmails": IpcConfig<
            [indexes: PstMailIndex[]],
            PstEmail[]
        >;
        "pstExtractor.event.stopExtract": IpcConfig<[], void>;
    }

    interface DualAsyncIpcMapping {
        "pstExtractor.event.progressSuscribe": DualIpcConfig<
            "pstExtractor.event.progress",
            [],
            [progressState: PstProgressState]
        >;
    }
}

export {};
