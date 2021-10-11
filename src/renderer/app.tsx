import "normalize.css/normalize.css";
import "./styles/global.scss";

import React, { useEffect, useState } from "react";

import { userConfig } from "../common/core/config";
import { Button } from "./components/Button";

export const App: React.FC = () => {
    const [title, setTitle] = useState("toto");

    useEffect(() => {
        setTimeout(() => {
            setTitle("JEANMI");
        }, 2000);
    });

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
