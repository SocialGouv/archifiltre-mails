import type { FC } from "react";
import React from "react";

import { Card } from "../../../renderer/components/common/card/Card";

export const DashboardInformations: FC = () => {
    return (
        <Card title="Informations" color="green">
            <div className="dashboard__informations">
                Informations relatives au PST.
            </div>
        </Card>
    );
};
