import "normalize.css/normalize.css";
import "./styles/global.scss";

import React, { useEffect, useState } from "react";

import { useService } from "../common/core/modules/ContainerModule";
import { Button } from "./components/Button";

export const App: React.FC = () => {
    const [title, setTitle] = useState("toto");

    const userConfig = useService("userConfigService");

    useEffect(() => {
        setTimeout(() => {
            setTitle("JEANMI");
        }, 2000);
    });

    if (!userConfig) {
        return <>Chargement...</>;
    }

    return (
        <div>
            Hello {title}
            <Button
                onClick={() => {
                    console.log(
                        userConfig.get("collectData"),
                        userConfig.get("locale"),
                        userConfig
                    );
                }}
            >
                Coucou BUTTON
            </Button>
        </div>
    );
};
