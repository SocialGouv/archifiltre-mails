import React from "react";

import { BUBBLE, HOME, START_SCREEN } from "../../../common/constants";
import { useWorkspaceRouteContext } from "../../context/WorkspaceRouter";
import { WorkspaceBubble } from "./WorkspaceBubble";
import { WorkspaceStartScreen } from "./WorkspaceStartScreen";

export const Workspace: React.FC = () => {
    const { route } = useWorkspaceRouteContext();
    switch (route) {
        case BUBBLE:
            return <WorkspaceBubble />;
        case START_SCREEN:
            return <WorkspaceStartScreen />;
        case HOME:
            return null;

        default:
            return null;
    }
};
