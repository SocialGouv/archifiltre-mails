import React from "react";

import style from "./Layout.module.scss";

interface LayoutProps {
    className: string;
    title?: string;
}

const LayoutTitle: React.FC<{ title: string | undefined }> = ({ title }) => (
    <div className={style.container__title}>
        <h1>{title}</h1>
    </div>
);

export const Layout: React.FC<LayoutProps> = ({
    children,
    className,
    title,
}) => (
    <section id={style.container} className={className}>
        {title ? <LayoutTitle title={title} /> : null}
        {children}
    </section>
);
