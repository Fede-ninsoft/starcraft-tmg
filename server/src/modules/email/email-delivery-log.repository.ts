import type { Pool, RowDataPacket } from 'mysql2/promise';

export type EmailMessageType = 'VERIFY_EMAIL' | 'RESET_PASSWORD' | 'SMTP_TEST' | 'ACCOUNT_VERIFIED' | 'SUPPORT_CREATED' | 'SUPPORT_REPLY';
export type EmailDeliveryStatus = 'SENT' | 'FAILED';
export type SupportedLocale = 'es' | 'en';

export interface EmailDeliveryLog {
  id: number;
  recipient: string;
  messageType: EmailMessageType;
  subject: string;
  locale: SupportedLocale;
  status: EmailDeliveryStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface EmailDeliveryLogRow extends RowDataPacket {
  id: number;
  recipient: string;
  message_type: EmailMessageType;
  subject: string;
  locale: SupportedLocale;
  status: EmailDeliveryStatus;
  provider_message_id: string | null;
  error_message: string | null;
  created_at: string;
}

export class EmailDeliveryLogRepository {
  constructor(private readonly pool: Pool) {}

  async record(input: Omit<EmailDeliveryLog, 'id' | 'createdAt'> & { locale?: SupportedLocale }): Promise<void> {
    await this.pool.execute(
      `INSERT INTO email_delivery_logs
        (recipient, message_type, subject, locale, status, provider_message_id, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.recipient,
        input.messageType,
        input.subject,
        input.locale ?? 'es',
        input.status,
        input.providerMessageId,
        input.errorMessage,
      ],
    );
  }

  async list(limit = 20, offset = 0): Promise<EmailDeliveryLog[]> {
    const safeLimit = Math.max(1, Math.min(100, Math.trunc(limit)));
    const safeOffset = Math.max(0, Math.min(10_000_000, Math.trunc(offset)));
    const [rows] = await this.pool.query<EmailDeliveryLogRow[]>(
      `SELECT id, recipient, message_type, subject, locale, status,
              provider_message_id, error_message, created_at
       FROM email_delivery_logs
       ORDER BY created_at DESC, id DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    );
    return rows.map((row) => ({
      id: row.id,
      recipient: row.recipient,
      messageType: row.message_type,
      subject: row.subject,
      locale: row.locale,
      status: row.status,
      providerMessageId: row.provider_message_id,
      errorMessage: row.error_message,
      createdAt: row.created_at,
    }));
  }

  async countSummary(): Promise<{ total: number; failed: number }> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END), 0) AS failed
         FROM email_delivery_logs`,
    );
    return { total: Number(rows[0]?.total ?? 0), failed: Number(rows[0]?.failed ?? 0) };
  }
}
