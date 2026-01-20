import { ErrorLevel } from 'src/entities/error-log.entity'

export class CreateErrorLogDto {
  level?: ErrorLevel
  message: string
  stackTrace?: string | null
  context?: string | null
  method?: string | null
  requestUrl?: string | null
  requestMethod?: string | null
  userId?: string | null
  metadata?: Record<string, unknown> | null
}
