import React from "react";

export const Loader: React.FC = ({ children }) => {
    return <div className="loader">{children ?? "Loading..."}</div>;
};
