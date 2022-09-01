import { getPercentage } from "@common/utils";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    ContactPicto,
    ExtremeDatePicto,
    FolderPicto,
    MailPicto,
    MailSentPicto,
    TrashPicto,
} from "../../components/common/pictos/picto";
import { usePstFileSizeStore } from "../../store/PstFileSizeStore";
import { usePstStore } from "../../store/PSTStore";
import { useSynthesisStore } from "../../store/SynthesisStore";
import {
    getDeletedMailIds,
    getMailIdsByStatus,
    getMailsAttachmentCount,
    getMailsAttachmentSize,
} from "../../utils/dashboard-recap";
import style from "./Dashboard.module.scss";
import { DashboardRecapItem } from "./DashboardRecapItem";

export const DashboardRecapItems: FC = () => {
    const { t } = useTranslation();
    const { totalFileSize } = usePstFileSizeStore();
    const { extractDatas } = usePstStore();
    const { deletedFolderId, ownerId } = useSynthesisStore();

    if (!extractDatas) return null;

    // TODO: mutualize / DRY
    const sentMailIds = getMailIdsByStatus(ownerId, extractDatas, "sent");
    const sentMailsCount = sentMailIds.length;
    const sentMailsAttachementCount = getMailsAttachmentCount(
        sentMailIds,
        extractDatas
    );
    const sentMailsAttachementSize = getMailsAttachmentSize(
        sentMailIds,
        extractDatas
    );
    const sentMailsAttachementPercentage = getPercentage(
        sentMailsAttachementSize,
        totalFileSize
    );

    const receivedMailIds = getMailIdsByStatus(
        ownerId,
        extractDatas,
        "received"
    );
    const receivedMailsCount = receivedMailIds.length;
    const receivedMailAttachmentCount = getMailsAttachmentCount(
        receivedMailIds,
        extractDatas
    );
    const receivedMailsAttachementSize = getMailsAttachmentSize(
        receivedMailIds,
        extractDatas
    );
    const receivedMailsAttachementPercentage = getPercentage(
        receivedMailsAttachementSize,
        totalFileSize
    );

    const deletedMailIds = getDeletedMailIds(deletedFolderId, extractDatas);
    const deletedMailsCount = deletedMailIds.length;
    const deletedMailsAttachmentCount = getMailsAttachmentCount(
        deletedMailIds,
        extractDatas
    );
    const deletedMailsAttachmentSize = getMailsAttachmentSize(
        deletedMailIds,
        extractDatas
    );
    const deletedMailsAttachmentPercentage = getPercentage(
        deletedMailsAttachmentSize,
        totalFileSize
    );

    const contactsCount = extractDatas.groups.recipient.size;

    const totalFolderSize = extractDatas.additionalDatas.folderList.length;

    const { min: minDate, max: maxDate } =
        extractDatas.additionalDatas.extremeDates;

    // TODO: move to default config (?)
    const extremeDateFormatParam: Intl.DateTimeFormatOptions = {
        dateStyle: "full",
    };

    return (
        <div className={style.dashboard__recap}>
            <DashboardRecapItem
                title={t("dashboard.recap.receivedMessages")}
                mails={receivedMailsCount}
                attachements={receivedMailAttachmentCount}
                percentage={receivedMailsAttachementPercentage}
                picto={<MailPicto />}
            />
            <DashboardRecapItem
                title={t("dashboard.recap.sentMessages")}
                mails={sentMailsCount}
                attachements={sentMailsAttachementCount}
                percentage={sentMailsAttachementPercentage}
                picto={<MailSentPicto />}
            />
            <DashboardRecapItem
                title={t("dashboard.recap.deletedMessages")}
                mails={deletedMailsCount}
                attachements={deletedMailsAttachmentCount}
                percentage={deletedMailsAttachmentPercentage}
                picto={<TrashPicto />}
            />
            <DashboardRecapItem
                title={t("dashboard.recap.contactsTitle")}
                contact={contactsCount}
                picto={<ContactPicto />}
            />
            <div className={style.dashboard__recap__item}>
                <div className={style.dashboard__recap__picto}>
                    <ExtremeDatePicto />
                </div>

                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {t("dashboard.recap.extremum")}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {t("dashboard.recap.extremum.minDate", {
                            formatParams: {
                                minDate: extremeDateFormatParam,
                            },
                            minDate: new Date(minDate),
                        })}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {t("dashboard.recap.extremum.maxDate", {
                            formatParams: {
                                maxDate: extremeDateFormatParam,
                            },
                            maxDate: new Date(maxDate),
                        })}
                    </span>
                </div>
            </div>
            <div className={style.dashboard__recap__item}>
                <div className={style.dashboard__recap__picto}>
                    <FolderPicto />
                </div>

                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {t("dashboard.recap.folderLabel")}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {t("dashboard.recap.folder", {
                            count: totalFolderSize,
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};
