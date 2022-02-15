import type { ComputedDatum } from "@nivo/circle-packing/dist/types/types";
import { useCallback, useEffect, useState } from "react";

import { useBreadcrumbStore } from "../store/BreadcrumbStore";
import { usePstFMInfosStore } from "../store/PstFMInfosStore";
import { usePstStore } from "../store/PSTStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import type {
    DefaultViewerObject,
    DomainViewerObject,
} from "../utils/dashboard-viewer-dym";
import {
    createCorrespondants,
    createDomain,
    createMails,
    createYears,
    getAggregatedDomainCount,
    getMailsByDym,
    getUniqueCorrespondantsByDomain,
    getYearByCorrespondants,
} from "../utils/dashboard-viewer-dym";

export interface UseDomainsYearMailsProps {
    currentView?: ViewState<DefaultViewerObject<string>>;
    computeNextView: (node: ComputedDatum<DefaultViewerObject<string>>) => void;
    restartView: () => void;
    computePreviousView: () => void;
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
 * A hook to manage the domain-year-mails vizualisation.
 *
 * DYM accronym of Domain Year Mails.
 * - Compute all next view following the current one.
 * - Allow breadcrumb dynamic display.
 * - Allow user to restart the view.
 * - Allow user to go back in the previous view
 */
export const useDymViewerNavigation = (): UseDomainsYearMailsProps => {
    const { pstFile } = usePstStore();
    const { setBreadcrumb } = useBreadcrumbStore();
    const { cancelFocus } = usePstFMInfosStore();
    const [currentDomain, setCurrentDomain] = useState<string>("");
    const [currentCorrespondant, setCurrentCorrespondant] =
        useState<string>("");

    const [currentView, setCurrentView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    const [domainView, setDomainView] =
        useState<ViewState<DomainViewerObject>>();

    const [correspondantView, setCorrespondantView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    const [yearView, setYearView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    const createInitialView = useCallback(() => {
        const aggregatedDomainCount = getAggregatedDomainCount(pstFile!);

        const computedInitialView = {
            elements: createDomain(aggregatedDomainCount),
            type: DOMAIN as ViewType,
        };

        setCurrentView(computedInitialView);
        setDomainView(computedInitialView);
    }, [pstFile]);

    const restartView = () => {
        setCurrentView(domainView);
        cancelFocus();
        setBreadcrumb({ id: "domain" });
    };

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const computePreviousView = () => {
        if (currentView?.type === CORRESPONDANTS) {
            setCurrentView(domainView);
        }
        if (currentView?.type === YEAR) {
            setCurrentView(correspondantView);
        }

        if (currentView?.type === MAILS) {
            setCurrentView(yearView);
        }

        return;
    };

    const computeNextView = (
        node: ComputedDatum<DefaultViewerObject<string>>
    ) => {
        if (currentView?.type === DOMAIN) {
            setCurrentDomain(node.data.name);
            setBreadcrumb({
                history: [node.data.name],
                id: "correspondant",
            });

            const uniqueCorrespondantsByDomain =
                getUniqueCorrespondantsByDomain(pstFile!, node.data.name);

            setCurrentView({
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    node.id
                ),
                type: CORRESPONDANTS,
            });

            setCorrespondantView({
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    node.id
                ),
                type: CORRESPONDANTS,
            });
        }

        if (currentView?.type === CORRESPONDANTS) {
            setBreadcrumb({
                history: [currentDomain, node.data.name],
                id: "year",
            });
            setCurrentCorrespondant(node.data.name);

            const yearByCorrespondants = getYearByCorrespondants(
                pstFile!,
                node.data.name
            );

            setCurrentView({
                elements: createYears(yearByCorrespondants, node.id),
                type: YEAR,
            });

            setYearView({
                elements: createYears(yearByCorrespondants, node.id),
                type: YEAR,
            });
        }

        if (currentView?.type === YEAR) {
            setBreadcrumb({
                history: [currentDomain, currentCorrespondant, node.data.name],
                id: "mails",
            });

            const mailsByYearAndCorrespondant = getMailsByDym(
                pstFile!,
                currentDomain,
                currentCorrespondant,
                +node.data.name
            );

            setCurrentView({
                elements: createMails(mailsByYearAndCorrespondant, node.id),
                type: MAILS,
            });
        }

        return;
    };

    return {
        computeNextView,
        computePreviousView,
        currentView,
        restartView,
    };
};
