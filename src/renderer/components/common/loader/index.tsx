import React from "react";
import { useTranslation } from "react-i18next";

export const Loader: React.FC = ({ children }) => {
    const { t } = useTranslation("common");
    return <div className="loader">{children ?? t("loader.loading")}</div>;
};
