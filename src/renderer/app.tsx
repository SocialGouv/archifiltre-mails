import "normalize.css/normalize.css";
import "./styles/global.scss";

import { useService } from "@common/modules/ContainerModule";
import React, { useEffect, useState } from "react";

import { Button } from "./components/Button";

export const App: React.FC = () => {
    const [title, setTitle] = useState("toto");

    const userConfigService = useService("userConfigService");
    const pstExtractorService = useService("pstExtractorService");

    useEffect(() => {
        setTimeout(() => {
            setTitle("JEANMI");
        }, 2000);
    });

    if (!userConfigService || !pstExtractorService) {
        return <>Chargement...</>;
    }

    return (
        <div>
            Hello {title}
            <Button
                onClick={async () => {
                    console.time("PST EXTRACT");
                    console.log(
                        await pstExtractorService.extract(
                            "/Users/lsagetlethias/Downloads/PST/archive.pst"
                            // "/Users/lsagetlethias/Downloads/test-archimail.pst"
                        )
                    );
                    console.timeEnd("PST EXTRACT");
                }}
            >
                Coucou BUTTON
            </Button>
        </div>
    );
};
