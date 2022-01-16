import type { PstExtractTables } from "@common/modules/pst-extractor/type";
import type { SimpleObject } from "@common/utils/type";

/**
 * Format the given emails table into a "readable" JSON for exporters to use.
 */
export const formatEmailTable = (
    emailsTable: PstExtractTables["emails"]
): SimpleObject[] =>
    [...emailsTable.values()].flat(1).map((email) => ({
        // TODO: i18n keys
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        /* eslint-disable @typescript-eslint/naming-convention */
        "N° identifiant": email.id,
        "Date et heure de la réception": email.receivedDate,
        "Date et heure de l'envoie": email.sentTime,
        "Nom de l'expéditeur": email.from.name,
        "Adresse mail de l'expéditeur": email.from.email ?? "",
        "Noms du ou des destinataire A": email.to
            .map((to) => to.name)
            .join(","),
        "Adresses mails du ou des destinataire A": email.to
            .map((to) => to.email)
            .join(","),
        "Noms du ou des destinataire CC": email.cc
            .map((cc) => cc.name)
            .join(","),
        "Adresses mails du ou des destinataire CC": email.cc
            .map((cc) => cc.email)
            .join(","),
        "Noms du ou des destinataire BCC": email.bcc
            .map((bcc) => bcc.name)
            .join(","),
        "Adresses mails du ou des destinataire BCC": email.bcc
            .map((bcc) => bcc.email)
            .join(","),
        "Objet du mail": email.subject,
        "Nombre de pièces jointes": email.attachementCount,
        "Taille des pièces joints (en octet)": email.attachements
            .map((attachement) => attachement.filesize)
            .join(","),
        "Noms pièces jointes": email.attachements
            .map((attachement) => attachement.filename)
            .join(","),
        "Contenu du message": email.contentText,
    }));
