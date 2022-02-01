import { useCallback, useEffect, useState } from "react";

import { usePstStore } from "../store/PSTStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import type {
    DefaultViewerObject,
    DomainViewerObject,
} from "../utils/pst-extractor";
import {
    createCorrespondants,
    createDomain,
    createMails,
    createYears,
    findAllMailAddresses,
    findMailsByDomainCorrespondantAndYear,
    findUniqueCorrespondantsByDomain,
    findYearByCorrespondants,
} from "../utils/pst-extractor";
import type { CirclePackingCommonProps } from "../utils/pst-viewer";

export interface UseDomainsYearMailsProps {
    currentView?: ViewState<DefaultViewerObject<string>>;
    computeNextView: CirclePackingCommonProps["onClick"];
    restartView: () => void;
}

export type ViewType =
    | typeof CORRESPONDANTS
    | typeof DOMAIN
    | typeof MAILS
    | typeof YEAR;
export interface ViewState<TElement> {
    elements: TElement;
    type: ViewType;
}

/**
 * TODO: COMMENT
 */
export const useDomainsYearsMails = (): UseDomainsYearMailsProps => {
    const { pstFile, setBreadcrumb } = usePstStore();
    const [currentDomain, setCurrentDomain] = useState<string>();
    const [currentCorrespondant, setCurrentCorrespondant] = useState<string>();

    const [currentView, setCurrentView] =
        useState<ViewState<DefaultViewerObject<string>>>();
    const [domainView, setDomainView] =
        useState<ViewState<DomainViewerObject>>();

    const createInitialView = useCallback(() => {
        const aggregatedDomainCount = findAllMailAddresses(pstFile!);

        const computedInitialView = {
            elements: createDomain(aggregatedDomainCount),
            type: DOMAIN as ViewType,
        };

        setCurrentView(computedInitialView);
        setDomainView(computedInitialView);
    }, [pstFile]);

    const restartView = () => {
        setCurrentView(domainView);
        setBreadcrumb("domaine"); // TODO: i18n
    };

    // TODO: click in root and back to previous viz
    const _computePreviousView = () => {
        return void 0;
    };

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const computeNextView: UseDomainsYearMailsProps["computeNextView"] = (
        node
    ) => {
        if (currentView?.type === DOMAIN) {
            setCurrentDomain(node.data.name);
            setBreadcrumb(`${node.data.name} > correspondant`);

            const uniqueCorrespondantsByDomain =
                findUniqueCorrespondantsByDomain(pstFile!, node.data.name);

            setCurrentView({
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    node.id
                ),
                type: CORRESPONDANTS,
            });
        }

        if (currentView?.type === CORRESPONDANTS) {
            setCurrentCorrespondant(node.data.name);
            setBreadcrumb(`${currentDomain} > ${node.data.name} > années`);

            const yearByCorrespondants = findYearByCorrespondants(
                pstFile!,
                node.data.name
            );

            setCurrentView({
                elements: createYears(yearByCorrespondants, node.id),
                type: YEAR,
            });
        }

        if (currentView?.type === YEAR) {
            setBreadcrumb(
                `${currentDomain} > ${currentCorrespondant} > ${node.data.name} > mails`
            );

            const mailsByYearAndCorrespondant =
                findMailsByDomainCorrespondantAndYear(
                    pstFile!,
                    currentDomain!,
                    currentCorrespondant!,
                    +node.data.name
                );

            setCurrentView({
                elements: createMails(mailsByYearAndCorrespondant, node.id),
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
