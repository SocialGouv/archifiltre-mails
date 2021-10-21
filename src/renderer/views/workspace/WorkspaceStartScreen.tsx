import React, { useCallback } from "react";

import { LayoutWorkspace } from "../../components/common/layout/LayoutWorkspace";
import { Dropzone } from "../../components/dropzone/Dropzone";
import style from "./WorkspaceStartScreen.module.scss";

export const WorkspaceStartScreen: React.FC = () => {
    const onDrop = useCallback((acceptedFiles, rejectediles) => {
        console.log(acceptedFiles, rejectediles);
    }, []);

    return (
        <LayoutWorkspace classname={style["start-screen"]}>
            <Dropzone onDrop={onDrop} accept={".pst"} />
        </LayoutWorkspace>
    );
};
