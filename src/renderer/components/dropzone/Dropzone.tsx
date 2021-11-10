import React, { useCallback } from "react";
import type { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";

import style from "./Dropzone.module.scss";

interface DropzoneProps {
    accept?: string[] | string | undefined;
    onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ accept, onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        onDrop,
    });

    const getClassName = useCallback((className: string, isActive: boolean) => {
        if (!isActive) return className;
        return `${style["dropzone-area"]} ${style["dropzone-area--active"]}`;
    }, []);

    return (
        <div className={style.dropzone}>
            <div className={style["dropzone-title"]}>
                <h1 todo-i18n>Téléchargez votre fichier ici</h1>
                <span todo-i18n>Votre fichier doit être un .pst</span>
            </div>
            <div
                className={getClassName(style["dropzone-area"], isDragActive)}
                {...getRootProps()}
            >
                <input
                    className="dropzone-input"
                    {...getInputProps({ multiple: false })}
                />
                <div className={style["dropzone-text"]}>
                    {isDragActive ? (
                        <p className="dropzone-text-item" todo-i18n>
                            Lâchez pour téléverser les fichiers
                        </p>
                    ) : (
                        <p className="dropzone-text-item" todo-i18n>
                            Cliquez ou glissez-déposez vos fichiers ici
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
