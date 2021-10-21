import React from "react";
import { useDropzone } from "react-dropzone";

import style from "./Dropzone.module.scss";

interface DropzoneProps {
    accept?: string[] | string | undefined;
    onDrop: (acceptedFiles: unknown, rejectediles: unknown) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ accept, onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        onDrop,
    });

    const getClassName = (className: string, isActive: boolean) => {
        if (!isActive) return className;
        return `${style["dropzone-area"]} ${style["dropzone-area--active"]}`;
    };

    return (
        <div className={style.dropzone}>
            <div className={style["dropzone-title"]}>
                <h1>Téléverser votre fichier ici</h1>
                <span>Votre fichier doit être un .pst</span>
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
                        <p className="dropzone-text-item">
                            {/* Release to drop the files here */}
                            Lâchez pour téléverser les fichiers
                        </p>
                    ) : (
                        <p className="dropzone-text-item">
                            {/* Drag n drop some files here, or click to select files */}
                            Cliquez ou glissez-déposez vos fichiers ici
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
