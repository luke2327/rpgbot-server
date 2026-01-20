import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ErrorLogEntity } from 'src/entities/error-log.entity'
import { CreateErrorLogDto } from 'src/dtos/create-error-log.dto'

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLogEntity)
    private readonly errorLogRepository: Repository<ErrorLogEntity>,
  ) {}

  async create(dto: CreateErrorLogDto): Promise<ErrorLogEntity> {
    const errorLog = this.errorLogRepository.create({
      level: dto.level ?? 'error',
      message: dto.message,
      stackTrace: dto.stackTrace ?? null,
      context: dto.context ?? null,
      method: dto.method ?? null,
      requestUrl: dto.requestUrl ?? null,
      requestMethod: dto.requestMethod ?? null,
      userId: dto.userId ?? null,
      metadata: dto.metadata ?? null,
    })
    return this.errorLogRepository.save(errorLog)
  }

  async findAll(): Promise<ErrorLogEntity[]> {
    return this.errorLogRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findByLevel(level: string): Promise<ErrorLogEntity[]> {
    return this.errorLogRepository.find({
      where: { level: level as ErrorLogEntity['level'] },
      order: { createdAt: 'DESC' },
    })
  }

  async findRecent(limit: number = 100): Promise<ErrorLogEntity[]> {
    return this.errorLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }
}
