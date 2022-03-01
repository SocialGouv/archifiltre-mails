import React from "react";

import { usePstStore } from "../../store/PSTStore";
import style from "./OwnerFinder.module.scss";

export const OwnerFinder: React.FC = () => {
    const { pstFile } = usePstStore();
    const list = pstFile?.children.flat(12);

    console.log({ list });

    return (
        <section className={style.finder}>
            <div className={style.finder__item}>
                <h1>Sélectionner le dossier des mails supprimés</h1>
            </div>
            <div className={style.finder__item}>
                <h1>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Chercher et/ou sélectionner l'adresse associée à cette
                    messagerie
                </h1>
            </div>
        </section>
    );
};
