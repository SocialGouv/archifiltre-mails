import React from "react";

import { Card } from "../../components/common/card/Card";
import { Loader } from "../../components/common/loader";

export const DashboardInformationsLoader: React.FC = () => (
    <Loader>
        <Card title="Informations" color="green">
            <p>
                Passer le curseur sur le visualiseur pour afficher des
                informations
            </p>
        </Card>
    </Loader>
);
