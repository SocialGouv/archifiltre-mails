import React from "react";

import style from "./Layout.module.scss";

export const Layout: React.FC<{ className: string }> = ({
    children,
    className,
}) => (
    <section id={style.container} className={className}>
        {children}
    </section>
);
