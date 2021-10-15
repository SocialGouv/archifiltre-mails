import "normalize.css/normalize.css";
import "./styles/global.scss";

import { useService } from "@common/modules/ContainerModule";
import React, { useEffect, useState } from "react";

import { Button } from "./components/Button";

export const App: React.FC = () => {
    const [title, setTitle] = useState("toto");

    const userConfigService = useService("userConfigService");

    useEffect(() => {
        setTimeout(() => {
            setTitle("JEANMI");
        }, 2000);
    });

    if (!userConfigService) {
        return <>Chargement...</>;
    }

    return (
        <div>
            Hello {title}
            <Button
                onClick={() => {
                    console.log(
                        userConfigService.get("collectData"),
                        userConfigService.get("locale"),
                        userConfigService
                    );
                }}
            >
                Coucou BUTTON
            </Button>
        </div>
    );
};
