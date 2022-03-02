import React from "react";

import style from "./OwnerFinder.module.scss";

interface OwnerFinderLandingProps {
    switchView: () => void;
}

export const OwnerFinderLanding: React.FC<OwnerFinderLandingProps> = ({
    switchView,
}) => {
    return (
        <div className={style.finder__landing}>
            <p>
                Afin de calculer les messages (reçus / envoyés / supprimés), les
                contacts, les dossiers et les dates extrêmes, cliquer sur
                commencer pour indiquer les dossiers correspondants
            </p>
            <button onClick={switchView}>Commencer</button>
        </div>
    );
};
