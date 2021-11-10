import { useService } from "@common/modules/ContainerModule";
import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useCallback, useEffect, useState } from "react";

import { usePathContext } from "../../context/PathContext";
import { LayoutWorkspace } from "../common/layout/LayoutWorkspace";
import { ClosePicto } from "../common/pictos/picto";
import style from "./CirclePacking.module.scss";

interface CirclePackingProps {
    closer: () => void;
}
interface CirclePackingCommonProps {
    height: number;
    id: keyof PstContent;
    labelsSkipRadius: number;
    padding: number;
    value: keyof PstContent;
    width: number;
    enableLabels: boolean;
    motionConfig: string;
}

const CIRCLE_PACKING_VALUES_HEIGHT = 500;
const CIRCLE_PACKING_VALUES_LABELSSKIPRADIUS = 16;
const CIRCLE_PACKING_VALUES_PADDING = 2;
const CIRCLE_PACKING_VALUES_WIDTH = 900;
const CIRCLE_PACKING_VALUES_MOTIONCONFIG = "slow";

const commonProperties: CirclePackingCommonProps = {
    enableLabels: true,
    height: CIRCLE_PACKING_VALUES_HEIGHT,
    id: "name",
    labelsSkipRadius: CIRCLE_PACKING_VALUES_LABELSSKIPRADIUS,
    motionConfig: CIRCLE_PACKING_VALUES_MOTIONCONFIG,
    padding: CIRCLE_PACKING_VALUES_PADDING,
    value: "contentSize",
    width: CIRCLE_PACKING_VALUES_WIDTH,
};

interface Node {
    id: string;
}
type ZoomFunction = (node: Node) => void;

export const CirclePacking: React.FC<CirclePackingProps> = ({ closer }) => {
    const [zoomedId, setZoomedId] = useState<string>("");
    const [extractedFile, setExtractedFile] = useState<PstContent>();
    const [infos, setInfos] = useState<PstProgressState>();
    const { path } = usePathContext();
    const pstExtractorService = useService("pstExtractorService");

    // TODO: Create a hook for Escape key handler to closer overlay
    useEffect(() => {
        const handleCloser = (event: KeyboardEvent) => {
            if (event.code === "Escape") {
                closer();
            }
        };
        window.addEventListener("keydown", handleCloser);

        return () => {
            window.removeEventListener("keydown", handleCloser);
        };
    }, [closer]);

    useEffect(() => {
        void (async () => {
            const pstExtractedFile = await pstExtractorService?.extract(path);
            setExtractedFile(pstExtractedFile);
        })();
    }, [pstExtractorService, path]);

    pstExtractorService?.onProgress(setInfos);

    const zoom = useCallback<ZoomFunction>(
        (node: Node) => {
            setZoomedId(zoomedId === node.id ? "" : node.id);
        },
        [zoomedId]
    );

    return (
        <LayoutWorkspace className={style["circle-packing"]}>
            {/* TODO: Extract views from this logic component, do ResponsiveCirclePacking outside comp */}
            {!extractedFile && (
                <>
                    <div className={style.spinner} />
                    <div className={style["circle-packing-pst-infos"]}>
                        <ul>
                            <li>nombre d emails : </li>
                            <li>{infos?.countEmail}</li>
                            <li>nombre de dossiers parcourus : </li>
                            <li>{infos?.countFolder}</li>
                            <li>nombre de pj : </li>
                            <li>{infos?.countAttachement}</li>
                            <li>nombre d éléments : </li>
                            <li>{infos?.countTotal}</li>
                        </ul>
                    </div>
                </>
            )}
            {extractedFile && (
                <ResponsiveCirclePacking
                    data={extractedFile}
                    labelsFilter={(label) => label.node.height === 0}
                    zoomedId={zoomedId}
                    onClick={zoom}
                    {...commonProperties}
                />
            )}
            <button className={style.close} onClick={closer}>
                <ClosePicto />
            </button>
        </LayoutWorkspace>
    );
};
