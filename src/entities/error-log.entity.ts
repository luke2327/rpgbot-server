import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

export type ErrorLevel = 'error' | 'warn' | 'fatal'

@Entity('error_logs')
export class ErrorLogEntity {
  @PrimaryGeneratedColumn({ name: 'error_log_id' })
  errorLogId: number

  @Index()
  @Column({ type: 'enum', enum: ['error', 'warn', 'fatal'], default: 'error' })
  level: ErrorLevel

  @Column({ type: 'varchar', length: 500 })
  message: string

  @Column({ name: 'stack_trace', type: 'text', nullable: true })
  stackTrace: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  context: string | null // e.g., 'UserService', 'AppController'

  @Column({ type: 'varchar', length: 100, nullable: true })
  method: string | null // e.g., 'saveUser', 'findAll'

  @Column({ name: 'request_url', type: 'varchar', length: 500, nullable: true })
  requestUrl: string | null

  @Column({ name: 'request_method', type: 'varchar', length: 10, nullable: true })
  requestMethod: string | null // GET, POST, PUT, DELETE, etc.

  @Column({ name: 'user_id', type: 'varchar', length: 100, nullable: true })
  userId: string | null // kakaoUserId or any user identifier

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown> | null // Additional context data

  @Index()
  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
}
