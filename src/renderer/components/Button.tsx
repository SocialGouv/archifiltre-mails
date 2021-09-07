import React from "react";

import style from "./Button.module.scss";

type ButtonProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export const Button: React.FC<ButtonProps> = (props) => (
    <button {...props} className={style.button}>
        {props.children}
    </button>
);
