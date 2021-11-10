import React from "react";

import style from "./LayoutWorkspace.module.scss";

export const LayoutWorkspace: React.FC<{ className: string }> = ({
    children,
    className,
}) => (
    <section id={style.workspace} className={className}>
        {children}
    </section>
);
