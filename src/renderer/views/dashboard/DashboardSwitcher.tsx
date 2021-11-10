import React from "react";

interface DashboardSwitcherProps {
    tab: string;
}

// TODO: Add routing for dashboard views. (To keep for future navigation between dashboard views)
export const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
    tab,
}) => <div>{tab}</div>;
