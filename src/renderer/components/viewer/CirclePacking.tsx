/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";

import { usePstStore } from "../../store/PSTStore";
import {
    findMailsByYearAndDomain,
    findYearByDomain,
    getAggregatedDomainsCount,
    getAllDomainsByAddresses,
    getAllUniqueMailAddresses,
    getDuplicatedDomainsCount,
    getDuplicatedYearByDomainCount,
} from "../../utils/pst-extractor";
import style from "./CirclePacking.module.scss";
import { CirclePackingViewer } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { pstFile } = usePstStore();
    const { updateComputedPst, setDepth } = usePstStore();

    const restartViewer = () => {
        if (pstFile) {
            updateComputedPst(pstFile, "root");
            setDepth(1);
        }
    };

    if (pstFile) {
        // DOMAINS
        const uniqueAddresses = getAllUniqueMailAddresses(pstFile);

        const domains = getAllDomainsByAddresses(uniqueAddresses);

        const duplicatedDomainsCount = getDuplicatedDomainsCount(domains);

        const aggregatedDomainCount = getAggregatedDomainsCount(
            duplicatedDomainsCount
        );

        // YEAR
        const yearByDomain = findYearByDomain(pstFile, "@culture.gouv.fr");
        const duplicatedYearByDomain =
            getDuplicatedYearByDomainCount(yearByDomain);

        // MAILS
        const mailsByYear = findMailsByYearAndDomain(
            pstFile,
            "@culture.gouv.fr",
            2014
        );
    }

    return (
        <div id="circle-packing" className={style["circle-packing"]}>
            <button onClick={restartViewer}>Restart</button>
            <CirclePackingViewer pstFile={pstFile} />
        </div>
    );
};
