CREATE TABLE IF NOT EXISTS tournaments (
  id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36) NOT NULL,
  status VARCHAR(20) NOT NULL,
  starts_at DATETIME NOT NULL,
  revision INT UNSIGNED NOT NULL DEFAULT 1,
  payload LONGTEXT NOT NULL CHECK (JSON_VALID(payload)),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX tournaments_directory (status, starts_at, id),
  INDEX tournaments_owner (owner_id, starts_at),
  FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tournament_audit (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tournament_id CHAR(36) NOT NULL,
  revision INT UNSIGNED NOT NULL,
  actor_id CHAR(36) NOT NULL,
  action VARCHAR(40) NOT NULL,
  detail LONGTEXT NOT NULL CHECK (JSON_VALID(detail)),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY tournament_audit_revision (tournament_id, revision),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
) ENGINE=InnoDB;
