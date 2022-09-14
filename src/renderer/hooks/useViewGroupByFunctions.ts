import { useService } from "@common/modules/ContainerModule";
import { builtInViewConfigs } from "@common/modules/views/setup";
import type { ViewGroupFunction } from "@common/modules/views/utils";
import { resolveViewConfiguration } from "@common/modules/views/utils";
import { useMemo } from "react";

interface UseViewGroupByFunctions {
    getCurrentViewGroupByFunctions: () => ViewGroupFunction[];
}

export const useViewGroupByFunctions = (): UseViewGroupByFunctions => {
    const userConfigService = useService("userConfigService");

    const getCurrentViewGroupByFunctions = () => {
        let viewConfigs = builtInViewConfigs;
        if (userConfigService) {
            viewConfigs = userConfigService.get("viewConfigs");
        }
        // return viewConfigs.map(resolveViewConfiguration);
        return useMemo(
            () => viewConfigs.map(resolveViewConfiguration),
            [viewConfigs]
        );
    };

    return { getCurrentViewGroupByFunctions };
};
