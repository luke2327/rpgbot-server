import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonstersEntity } from './entities/monsters.entity'
import { MonstersService } from './monsters.service'
import { MonstersController } from './monsters.controller'
import { CharactersEntity } from 'src/user/entities/characters.entity'
import { StatsEntity } from 'src/user/entities/stats.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([MonstersEntity, CharactersEntity, StatsEntity]),
  ],
  providers: [MonstersService],
  controllers: [MonstersController],
  exports: [MonstersService], // 다른 모듈에서 서비스 쓸 수 있게
})
export class MonstersModule {}
