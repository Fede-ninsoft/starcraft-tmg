ALTER TABLE users
  ADD INDEX IF NOT EXISTS users_created_id_idx (created_at, id);

ALTER TABLE support_tickets
  ADD INDEX IF NOT EXISTS support_tickets_status_updated_id_idx (status, updated_at, id),
  ADD INDEX IF NOT EXISTS support_tickets_updated_id_idx (updated_at, id);

ALTER TABLE email_delivery_logs
  ADD INDEX IF NOT EXISTS email_delivery_logs_created_id_idx (created_at, id);

ALTER TABLE game_sessions
  ADD INDEX IF NOT EXISTS game_sessions_admin_summary_idx (owner_type, owner_account_id, status, updated_at);
