import "normalize.css/normalize.css";
import "./styles/global.scss";

import { useService } from "@common/modules/ContainerModule";
import type { PstProgressState } from "@common/modules/pst-extractor/type";
import React, { useEffect, useState } from "react";

import { Button } from "./components/Button";

export const App: React.FC = () => {
    const [title, setTitle] = useState("toto");
    const [progress, setProgress] = useState<PstProgressState>();

    const userConfigService = useService("userConfigService");
    const pstExtractorService = useService("pstExtractorService");

    useEffect(() => {
        setTimeout(() => {
            setTitle("JEANMI");
        }, 2000);
    }, []);

    return (
        <div>
            Hello {title} {userConfigService?.get("locale")}
            <pre>{JSON.stringify(progress)}</pre>
            <Button
                onClick={async () => {
                    console.time("PST EXTRACT");
                    pstExtractorService?.onProgress(setProgress);
                    try {
                        console.log(
                            await pstExtractorService?.extract({
                                // depth: 2,
                                pstFilePath:
                                    // "/Users/lsagetlethias/Downloads/PST/archive.pst",
                                    "/Users/lsagetlethias/Downloads/liamihcra.pst",
                                // "/Users/lsagetlethias/Downloads/test.pst",
                                // "/Users/lsagetlethias/Downloads/sample.pst",
                                // "/Users/lsagetlethias/Downloads/test-archimail.pst",
                            })
                        );
                    } catch (e: unknown) {
                        console.info("Interupted", (e as Error).message || e);
                    }
                    console.timeEnd("PST EXTRACT");
                }}
            >
                Coucou BUTTON
            </Button>
            <Button onClick={() => pstExtractorService?.stop()}>Stop ?</Button>
        </div>
    );
};
