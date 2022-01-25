import type { Any } from "@common/utils/type";
import { useCallback, useEffect, useState } from "react";

import { usePstStore } from "../store/PSTStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import {
    _createYears,
    _findYearByCorrespondants,
    createCorrespondants,
    createDomain,
    createMails,
    findAllMailAddresses,
    findMailsByDomainCorrespondantAndYear,
    findUniqueCorrespondantsByDomain,
} from "../utils/pst-extractor";

export interface UseDomainsYearMailsProps {
    currentView: Any;
    computeNextView: (data: Any) => void;
    restartView: () => void;
}

export const useDomainsYearsMails = (): UseDomainsYearMailsProps => {
    const { pstFile } = usePstStore();
    const [currentDomain, setCurrentDomain] = useState("");
    const [currentCorrespondant, setCurrentCorrespondant] = useState("");
    const [currentView, setCurrentView] = useState({ elements: {}, type: "" });

    const createInitialView = useCallback(() => {
        const aggregatedDomainCount = findAllMailAddresses(pstFile!);

        setCurrentView({
            elements: createDomain(aggregatedDomainCount),
            type: DOMAIN,
        });
    }, [pstFile]);

    const restartView = () => {
        createInitialView();
    };

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const computeNextView = (data: Any) => {
        if (currentView.type === DOMAIN) {
            setCurrentDomain(data.data.name as string);

            const uniqueCorrespondantsByDomain =
                findUniqueCorrespondantsByDomain(
                    pstFile!,
                    data.data.name as string
                );

            setCurrentView({
                elements: createCorrespondants(uniqueCorrespondantsByDomain),
                type: CORRESPONDANTS,
            });
        }

        if (currentView.type === CORRESPONDANTS) {
            setCurrentCorrespondant(data.data.name as string);

            const _yearByCorrespondants = _findYearByCorrespondants(
                pstFile!,
                data.data.name as string
            );

            setCurrentView({
                elements: _createYears(_yearByCorrespondants),
                type: YEAR,
            });
        }

        if (currentView.type === YEAR) {
            const mailsByYearAndCorrespondant =
                findMailsByDomainCorrespondantAndYear(
                    pstFile!,
                    currentDomain,
                    currentCorrespondant,
                    data.data.name as number
                );

            setCurrentView({
                elements: createMails(mailsByYearAndCorrespondant),
                type: MAILS,
            });
        }

        return void 0;
    };

    return {
        computeNextView,
        currentView,
        restartView,
    };
};
