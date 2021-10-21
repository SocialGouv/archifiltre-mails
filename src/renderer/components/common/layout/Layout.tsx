import React from "react";

import style from "./Layout.module.scss";

export const Layout: React.FC<{ classname: string }> = ({
    children,
    classname,
}) => (
    <section id={style.container} className={classname}>
        {children}
    </section>
);
