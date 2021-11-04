import { useService } from "@common/modules/ContainerModule";
import type { PstContent } from "@common/modules/pst-extractor/type";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useCallback, useEffect, useState } from "react";

import { CONTENT_SIZE, NAME, SLOW } from "../../../renderer/utils/constants";
import { LayoutWorkspace } from "../common/layout/LayoutWorkspace";
import { ClosePicto } from "../common/pictos/picto";
import style from "./Bubble.module.scss";

interface BubbleProps {
    closer: () => void;
}
interface Node {
    id: string;
}

type ZoomFunction = (node: Node) => void;

// data object for testing purpose
const data = {
    children: [
        {
            children: [
                { contentSize: 1, name: "Deleted Items" },
                {
                    children: [
                        {
                            contentSize: 1,
                            name: "subfolder1",
                        },
                        { name: "Sender Name " },
                    ],

                    contentSize: 1,
                    name: "myInbox",
                },
                { contentSize: 1, name: "subfolder" },
            ],

            contentSize: 1,
            name: "Top of Personal Folders",
        },
        { contentSize: 1, name: "Search Root" },
        { contentSize: 1, name: "SPAM Search Folder 2" },
        { contentSize: 1, name: "ItemProcSearch" },
        { contentSize: 1, name: "IPM_COMMON_VIEWS" },
    ],

    contentSize: 1,
    name: "",
};

export const Bubble: React.FC<BubbleProps> = ({ closer }) => {
    const [zoomedId, setZoomedId] = useState<string | null>(null);
    const [extractedFile, setExtractedFile] = useState<PstContent>();
    const pstExtractorService = useService("pstExtractorService");

    useEffect(() => {
        void (async () => {
            const pstExtractedFile = await pstExtractorService?.extract(
                "/Users/mehdi/Downloads/archive.pst" // arbitrary path
            );
            setExtractedFile(pstExtractedFile);
        })();
    }, [pstExtractorService]);

    const zoom = useCallback<ZoomFunction>(
        (node: Node) => {
            setZoomedId(zoomedId === node.id ? null : node.id);
        },
        [zoomedId]
    );

    const commonProperties = {
        data: extractedFile,
        height: 500,
        id: NAME,
        labelsSkipRadius: 16,
        padding: 2,
        value: CONTENT_SIZE,
        width: 900,
    };

    return (
        <LayoutWorkspace classname={style.bubble}>
            {extractedFile && (
                <ResponsiveCirclePacking
                    {...commonProperties}
                    enableLabels
                    labelsSkipRadius={16}
                    labelsFilter={(label) => label.node.height === 0}
                    zoomedId={zoomedId}
                    motionConfig={SLOW}
                    onClick={zoom}
                />
            )}
            <button className={style.close} onClick={closer}>
                <ClosePicto />
            </button>
        </LayoutWorkspace>
    );
};
