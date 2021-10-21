import React from "react";

import style from "./LayoutWorkspace.module.scss";

export const LayoutWorkspace: React.FC<{ classname: string }> = ({
    children,
    classname,
}) => (
    <section id={style.workspace} className={classname}>
        {children}
    </section>
);
