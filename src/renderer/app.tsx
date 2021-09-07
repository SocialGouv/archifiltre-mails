import "normalize.css/normalize.css";
import "./styles/global.scss";

import React, { useEffect, useState } from "react";

import { Button } from "./components/Button";
import { ButtonSASS } from "./components/ButtonSASS";

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
            <Button>Coucou BUTTON</Button>
            <ButtonSASS>COUCOU ButtonSASS</ButtonSASS>
        </div>
    );
};
