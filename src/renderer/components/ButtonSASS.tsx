import React from "react";

import style from "./ButtonSASS.module.sass";

type ButtonSASSProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export const ButtonSASS: React.FC<ButtonSASSProps> = (props) => (
    <button {...props} className={style.albert}>
        {props.children}
    </button>
);
