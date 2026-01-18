import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common'

export interface LogContext {
  requestId?: string
  userId?: string
  method?: string
  [key: string]: unknown
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string
  private metadata: LogContext = {}

  setContext(context: string): this {
    this.context = context
    return this
  }

  setMetadata(metadata: LogContext): this {
    this.metadata = { ...this.metadata, ...metadata }
    return this
  }

  private formatMessage(message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const ctx = context ? { ...this.metadata, ...context } : this.metadata
    const contextStr = Object.keys(ctx).length > 0 ? ` ${JSON.stringify(ctx)}` : ''
    const prefix = this.context ? `[${this.context}]` : ''
    return `${timestamp} ${prefix} ${message}${contextStr}`
  }

  log(message: string, context?: LogContext): void {
    console.log(this.formatMessage(message, context))
  }

  error(message: string, trace?: string, context?: LogContext): void {
    console.error(this.formatMessage(message, context))
    if (trace) {
      console.error(trace)
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(message, context))
  }

  debug(message: string, context?: LogContext): void {
    console.debug(this.formatMessage(message, context))
  }

  verbose(message: string, context?: LogContext): void {
    console.log(this.formatMessage(message, context))
  }
}
