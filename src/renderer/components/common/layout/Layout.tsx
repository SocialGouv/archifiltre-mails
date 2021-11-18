import React from "react";

import style from "./Layout.module.scss";

interface LayoutProps {
    className: string;
    title: string;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    className,
    title,
}) => (
    <section id={style.container} className={className}>
        <div className={style.container__title}>
            <h1>{title}</h1>
        </div>
        {children}
    </section>
);
