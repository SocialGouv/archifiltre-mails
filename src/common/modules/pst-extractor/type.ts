import type { long } from "@common/utils/type";
import type { PSTAttachment, PSTRecipient } from "pst-extractor";

/**
 * Main content of a PST extract.
 */
export interface PstContent {
    name: string;
    email?: PSTExtractorEmail;
    size?: number;
    contentSize?: number;
    children?: PstContent[];
}

/**
 * State object on each progress tick (one tick per extracted email).
 */
export interface PstProgressState {
    progress: boolean;
    countTotal: number;
    countEmail: number;
    countFolder: number;
    countAttachement: number;
    elapsed: number;
}

/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-namespace -- All outlook sub types grouped
export namespace Outlook {
    export const enum AcknowledgementMode {
        MANUAL = 0,
        AUTOMATIC = 1,
    }

    export const enum Importance {
        LOW = 0,
        NORMAL = 1,
        HIGH = 2,
    }

    export const enum RecipientType {
        TO = 1,
        CC = 2,
    }
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Raw content of an email item.
 */
export interface PSTExtractorEmail {
    /**
     * Get specific recipient.
     */
    readonly getRecipient: (recipientNumber: number) => PSTRecipient | null;
    /**
     * Get specific attachment from table using index.
     */
    readonly getAttachment: (attachmentNumber: number) => PSTAttachment;
    /**
     * Acknowledgment mode Integer 32-bit signed.
     */
    readonly acknowledgementMode: Outlook.AcknowledgementMode;
    /**
     * Contains the messaging user's e-mail address type, such as SMTP.
     * https://msdn.microsoft.com/en-us/library/office/cc815548.aspx
     */
    readonly addrType: string;
    /**
     * Specifies the hide or show status of a folder.
     * https://msdn.microsoft.com/en-us/library/ee159038(v=exchg.80).aspx
     */
    readonly attrHidden: boolean;
    /**
     * @deprecated use {@link originalSubject} instead
     */
    readonly bloriginalSubjectah: string;
    /**
     * Plain text message body.
     * https://msdn.microsoft.com/en-us/library/office/cc765874.aspx
     */
    readonly body: string;
    /**
     * Contains the HTML version of the message text.
     */
    readonly bodyHTML: string;
    /**
     * Plain text body prefix.
     */
    readonly bodyPrefix: string;
    /**
     * Contains the Rich Text Format (RTF) version of the message text, usually in compressed form.
     * https://technet.microsoft.com/en-us/library/cc815911
     */
    readonly bodyRTF: string;
    /**
     * Contains the date and time the message sender submitted a message.
     * https://technet.microsoft.com/en-us/library/cc839781
     */
    readonly clientSubmitTime: Date | null;
    /**
     * Color categories.
     */
    readonly colorCategories: string[];
    /**
     * Contains a comment about the purpose or content of an object.
     * https://msdn.microsoft.com/en-us/library/office/cc842022.aspx
     */
    readonly comment: string;
    /**
     * Contains a computed value derived from other conversation-related properties.
     * https://msdn.microsoft.com/en-us/library/ee204279(v=exchg.80).aspx
     */
    readonly conversationId: Buffer | null;
    /**
     * Contains the topic of the first message in a conversation thread.
     * https://technet.microsoft.com/en-us/windows/cc839841
     */
    readonly conversationTopic: string;
    /**
     * Contains the creation date and time of a message.
     * https://msdn.microsoft.com/en-us/library/office/cc765677.aspx
     */
    readonly creationTime: Date | null;
    /**
     * Contains TRUE if a client application wants MAPI to delete the associated message after submission.
     * https://msdn.microsoft.com/en-us/library/office/cc842353.aspx
     */
    readonly deleteAfterSubmit: boolean;
    /**
     * Contains an ASCII list of the display names of any blind carbon copy (BCC) message recipients, separated by semicolons (;).
     * https://msdn.microsoft.com/en-us/library/office/cc815730.aspx
     */
    readonly displayBCC: string;
    /**
     * Contains an ASCII list of the display names of any carbon copy (CC) message recipients, separated by semicolons (;).
     * https://msdn.microsoft.com/en-us/library/office/cc765528.aspx
     */
    readonly displayCC: string;
    /**
     * Contains a list of the display names of the primary (To) message recipients, separated by semicolons (;).
     * https://msdn.microsoft.com/en-us/library/office/cc839687.aspx
     */
    readonly displayTo: string;
    /**
     * Contains the messaging user's e-mail address.
     * https://msdn.microsoft.com/en-us/library/office/cc842372.aspx
     */
    readonly emailAddress: string;
    /**
     * The message has at least one attachment.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly hasAttachments: boolean;
    /**
     * Contains a number that indicates which icon to use when you display a group of e-mail objects.
     * https://msdn.microsoft.com/en-us/library/office/cc815472.aspx
     */
    readonly iconIndex: number;
    /**
     *  Importance of email (sender determined)
     * https://msdn.microsoft.com/en-us/library/cc815346(v=office.12).aspx
     */
    readonly importance: Outlook.Importance;
    /**
     * Contains the original message's PR_INTERNET_MESSAGE_ID (PidTagInternetMessageId) property value.
     * https://msdn.microsoft.com/en-us/library/office/cc839776.aspx
     */
    readonly inReplyToId: string;
    /**
     * A number associated with an item in a message store.
     * https://msdn.microsoft.com/en-us/library/office/cc815718.aspx
     */
    readonly internetArticleNumber: number;
    /**
     * Corresponds to the message ID field as specified in [RFC2822].
     * https://msdn.microsoft.com/en-us/library/office/cc839521.aspx
     */
    readonly internetMessageId: string;
    /**
     * The message is an FAI message.  An FAI Message object is used to store a variety of settings and
     * auxiliary data, including forms, views, calendar options, favorites, and category lists.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isAssociated: boolean;
    /**
     * Indicates whether the GUID portion of the PidTagConversationIndex property (section 2.641) is to be used to compute the PidTagConversationId property (section 2.640).
     * https://msdn.microsoft.com/en-us/library/ee218393(v=exchg.80).aspx
     */
    readonly isConversationIndexTracking: boolean;
    /**
     * The user receiving the message was also the user who sent the message.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isFromMe: boolean;
    /**
     * Contains TRUE if a message sender wants notification of non-receipt for a specified recipient.
     * https://msdn.microsoft.com/en-us/library/office/cc979208.aspx
     */
    readonly isNonReceiptNotificationRequested: boolean;
    /**
     * Contains TRUE if a message sender wants notification of non-deliver for a specified recipient.
     * https://msdn.microsoft.com/en-us/library/ms987568(v=exchg.65).aspx
     */
    readonly isOriginatorNonDeliveryReportRequested: boolean;
    /**
     * Contains TRUE if the PR_RTF_COMPRESSED (PidTagRtfCompressed) property has the same text content as the PR_BODY (PidTagBody) property for this message.
     * https://msdn.microsoft.com/en-us/library/office/cc765844.aspx
     */
    readonly isRTFInSync: boolean;
    /**
     * The message is marked as having been read.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isRead: boolean;
    /**
     * Contains TRUE if a message sender requests a reply from a recipient.
     * https://msdn.microsoft.com/en-us/library/office/cc815286.aspx
     */
    readonly isReplyRequested: boolean;
    /**
     * The message includes a request for a resend operation with a nondelivery report.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isResent: boolean;
    /**
     * The message is marked for sending as a result of a call to the RopSubmitMessage ROP
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isSubmitted: boolean;
    /**
     * The outgoing message has not been modified since the first time that it was saved; the incoming message has not been modified since it was delivered.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isUnmodified: boolean;
    /**
     * The message is still being composed. It is saved, but has not been sent.
     * https://msdn.microsoft.com/en-us/library/ee160304(v=exchg.80).aspx
     */
    readonly isUnsent: boolean;
    /**
     * Contains the time when the last verb was executed.
     * https://msdn.microsoft.com/en-us/library/office/cc839918.aspx
     */
    readonly lastVerbExecutionTime: Date | null;
    /**
     * Contains TRUE if this messaging user is specifically named as a carbon copy (CC) recipient of this message and is not part of a distribution list.
     * https://msdn.microsoft.com/en-us/library/office/cc839713.aspx
     */
    readonly messageCcMe: boolean;
    /**
     *  Contains a text string that identifies the sender-defined message class, such as IPM.Note.
     * https://msdn.microsoft.com/en-us/library/office/cc765765.aspx
     */
    readonly messageClass: string;
    /**
     * Contains the date and time when a message was delivered.
     * https://msdn.microsoft.com/en-us/library/office/cc841961.aspx
     */
    readonly messageDeliveryTime: Date | null;
    /**
     * Contains TRUE if this messaging user is specifically named as a primary (To), carbon copy (CC), or blind carbon copy (BCC) recipient of this message and is not part of a distribution list.
     * https://msdn.microsoft.com/en-us/library/office/cc842268.aspx
     */
    readonly messageRecipMe: boolean;
    /**
     * Contains the sum, in bytes, of the sizes of all properties on a message object
     * https://technet.microsoft.com/en-us/library/cc842471
     */
    readonly messageSize: long;
    /**
     * Contains TRUE if this messaging user is specifically named as a primary (To) recipient of this message and is not part of a distribution list.
     * https://technet.microsoft.com/en-us/library/cc815755
     */
    readonly messageToMe: boolean;
    /**
     * Contains the date and time when the object or subobject was last modified.
     * https://msdn.microsoft.com/en-us/library/office/cc815689.aspx
     */
    readonly modificationTime: Date | null;
    /**
     * Specifies the server that a client is currently attempting to use to send e-mail.
     * https://technet.microsoft.com/en-us/library/cc842327(v=office.14)
     */
    readonly nextSendAcct: string;
    /**
     * Number of attachments by counting rows in attachment table.
     */
    readonly numberOfAttachments: number;
    /**
     * Number of recipients by counting rows in recipient table.
     */
    readonly numberOfRecipients: number;
    /**
     * Contains the type of an object.
     * https://msdn.microsoft.com/en-us/library/office/cc815487.aspx
     */
    readonly objectType: number;
    /**
     * Contains the display names of any carbon copy (CC) recipients of the original message.
     * https://msdn.microsoft.com/en-us/magazine/cc815841(v=office.14).aspx
     */
    readonly originalDisplayBcc: string;
    /**
     * Contains the display names of any carbon copy (CC) recipients of the original message.
     * https://msdn.microsoft.com/en-us/magazine/cc815841(v=office.14).aspx
     */
    readonly originalDisplayCc: string;
    /**
     * Contains the display names of the primary (To) recipients of the original message.
     * https://msdn.microsoft.com/en-us/magazine/cc842235(v=office.14).aspx
     */
    readonly originalDisplayTo: string;
    /**
     * Contains the sensitivity value assigned by the sender of the first version of a message that is, the message before being forwarded or replied to.
     * https://msdn.microsoft.com/en-us/library/cc839694(office.12).aspx
     */
    readonly originalSensitivity: number;
    /**
     * Contains the subject of an original message for use in a report about the message.
     * https://msdn.microsoft.com/en-us/library/office/cc842182.aspx
     */
    readonly originalSubject: string;
    /**
     * Contains TRUE if a message sender requests a delivery report for a particular recipient from the messaging system before the message is placed in the message store.
     * https://msdn.microsoft.com/en-us/library/office/cc765845.aspx
     */
    readonly originatorDeliveryReportRequested: boolean;
    /**
     * Contains the search key for the messaging user represented by the sender.
     * https://msdn.microsoft.com/en-us/magazine/cc842068.aspx
     */
    readonly pidTagSentRepresentingSearchKey: Buffer | null;
    /**
     * Contains a string that names the first server that is used to send the message.
     * https://msdn.microsoft.com/en-us/library/office/cc815413.aspx
     */
    readonly primarySendAccount: string;
    /**
     * Contains the relative priority of a message.
     * https://msdn.microsoft.com/en-us/library/office/cc765646.aspx
     */
    readonly priority: number;
    /**
     * Contains the address type for the messaging user who is represented by the user actually receiving the message.
     * https://msdn.microsoft.com/en-us/library/office/cc842447.aspx
     */
    readonly rcvdRepresentingAddrtype: string;
    /**
     * Contains the e-mail address for the messaging user who is represented by the receiving user.
     * https://msdn.microsoft.com/en-us/library/office/cc815875.aspx
     */
    readonly rcvdRepresentingEmailAddress: string;
    /**
     * Contains the display name for the messaging user who is represented by the receiving user.
     * https://technet.microsoft.com/en-us/library/cc842260.aspx
     */
    readonly rcvdRepresentingName: string;
    /**
     * Contains TRUE if a message sender wants the messaging system to generate a read report when the recipient has read a message.
     * https://msdn.microsoft.com/en-us/library/office/cc842094.aspx
     */
    readonly readReceiptRequested: boolean;
    /**
     * Contains the e-mail address for the messaging user who receives the message.
     * https://technet.microsoft.com/en-us/library/cc839550(v=office.14)
     */
    readonly receivedByAddress: string;
    /**
     * Contains the e-mail address type, such as SMTP, for the messaging user who actually receives the message.
     * https://technet.microsoft.com/en-us/library/cc765641(v=office.14)
     */
    readonly receivedByAddressType: string;
    /**
     * Contains the display name of the messaging user who receives the message.
     * https://msdn.microsoft.com/en-us/library/office/cc840015.aspx
     */
    readonly receivedByName: string;
    /**
     * Specifies whether adding additional recipients, when forwarding the message, is prohibited for the e-mail message.
     * https://msdn.microsoft.com/en-us/library/office/cc979216.aspx
     */
    readonly recipientReassignmentProhibited: boolean;
    /**
     * Contains the recipient type for a message recipient.
     * https://msdn.microsoft.com/en-us/library/office/cc839620.aspx
     */
    readonly recipientType: Outlook.RecipientType;
    /**
     * Specifies the interval, in minutes, between the time when the reminder first becomes overdue and the start time of the calendar object.
     * https://msdn.microsoft.com/en-us/library/office/cc765535.aspx
     */
    readonly reminderDelta: number;
    /**
     * Specifies whether a reminder is set on the object.
     * https://msdn.microsoft.com/en-us/library/office/cc765589.aspx
     */
    readonly reminderSet: boolean;
    /**
     *  Contains a list of display names for recipients that are to get a reply.
     * https://msdn.microsoft.com/en-us/library/windows/desktop/cc815850.aspx
     */
    readonly replyRecipientNames: string;
    /**
     * Contains TRUE if the message sender wants a response to a meeting request.
     * https://msdn.microsoft.com/en-us/library/office/cc839921.aspx
     */
    readonly responseRequested: boolean;
    /**
     * Contains TRUE if some transport provider has already accepted responsibility for delivering the message to this recipient, and FALSE if the MAPI spooler considers that this transport provider should accept responsibility.
     * https://msdn.microsoft.com/en-us/library/office/cc765767.aspx
     */
    readonly responsibility: boolean;
    /**
     * Contains the value of a Multipurpose Internet Mail Extensions (MIME) message's Return-Path header field. The e-mail address of the message's sender.
     * https://msdn.microsoft.com/en-us/library/office/cc765856.aspx
     */
    readonly returnPath: string;
    /**
     *  Contains the cyclical redundancy check (CRC) computed for the message text.
     * https://technet.microsoft.com/en-us/library/cc815532(v=office.15).aspx
     */
    readonly rtfSyncBodyCRC: number;
    /**
     *
     */
    readonly rtfSyncBodyCount: number;
    /**
     * Contains significant characters that appear at the beginning of the message text.
     * https://technet.microsoft.com/en-us/library/cc815400(v=office.15).aspx
     */
    readonly rtfSyncBodyTag: string;
    /**
     * Contains a count of the ignorable characters that appear before the significant characters of the message.
     * https://msdn.microsoft.com/en-us/magazine/cc842437.aspx
     */
    readonly rtfSyncPrefixCount: number;
    /**
     * Contains a count of the ignorable characters that appear after the significant characters of the message.
     * https://msdn.microsoft.com/en-us/magazine/cc765795.aspx
     */
    readonly rtfSyncTrailingCount: number;
    /**
     * Contains the message sender's e-mail address type.
     * https://msdn.microsoft.com/en-us/library/office/cc815748.aspx
     */
    readonly senderAddrtype: string;
    /**
     * Contains the message sender's e-mail address.
     * https://msdn.microsoft.com/en-us/library/office/cc839670.aspx
     */
    readonly senderEmailAddress: string;
    /**
     * Contains the message sender's entry identifier.
     * https://msdn.microsoft.com/en-us/library/office/cc815625.aspx
     */
    readonly senderEntryId: Buffer | null;
    /**
     * Contains the message sender's display name.
     * https://msdn.microsoft.com/en-us/library/office/cc815457.aspx
     */
    readonly senderName: string;
    /**
     * Contains a value that indicates the message sender's opinion of the sensitivity of a message.
     * https://msdn.microsoft.com/en-us/library/office/cc839518.aspx
     */
    readonly sensitivity: number;
    /**
     * Contains the address type for the messaging user who is represented by the sender.
     * https://msdn.microsoft.com/en-us/library/office/cc839677.aspx
     */
    readonly sentRepresentingAddressType: string;
    /**
     * Contains the e-mail address for the messaging user who is represented by the sender.
     * https://msdn.microsoft.com/en-us/library/office/cc839552.aspx
     */
    readonly sentRepresentingEmailAddress: string;
    /**
     * Contains the display name for the messaging user represented by the sender.
     * https://msdn.microsoft.com/en-us/library/office/cc842405.aspx
     */
    readonly sentRepresentingName: string;
    /**
     * Contains the full subject of a message.
     * https://technet.microsoft.com/en-us/library/cc815720
     */
    readonly subject: string;
    /**
     * Represents the date when the user expects to complete the task.
     * https://technet.microsoft.com/en-us/library/cc839641(v=office.12).aspx
     */
    readonly taskDueDate: Date | null;
    /**
     * Specifies the date on which the user expects work on the task to begin.
     * https://technet.microsoft.com/en-us/library/cc815922(v=office.12).aspx
     */
    readonly taskStartDate: Date | null;
    /**
     * Contains transport-specific message envelope information.
     * https://technet.microsoft.com/en-us/library/cc815628
     */
    readonly transportMessageHeaders: string;
    /**
     * The URL component name for a message.
     * https://msdn.microsoft.com/en-us/library/office/cc815653.aspx
     */
    readonly urlCompName: string;
}
