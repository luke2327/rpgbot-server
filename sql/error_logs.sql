-- error_logs 테이블 생성
CREATE TABLE IF NOT EXISTS `error_logs` (
  `error_log_id` INT NOT NULL AUTO_INCREMENT,
  `level` ENUM('error', 'warn', 'fatal') NOT NULL DEFAULT 'error',
  `message` VARCHAR(500) NOT NULL,
  `stack_trace` TEXT NULL,
  `context` VARCHAR(100) NULL COMMENT 'Class name (e.g., UserService)',
  `method` VARCHAR(100) NULL COMMENT 'Method name (e.g., saveUser)',
  `request_url` VARCHAR(500) NULL,
  `request_method` VARCHAR(10) NULL COMMENT 'GET, POST, PUT, DELETE, etc.',
  `user_id` VARCHAR(100) NULL COMMENT 'kakaoUserId or any user identifier',
  `metadata` JSON NULL COMMENT 'Additional context data',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`error_log_id`),
  INDEX `idx_level` (`level`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
