import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonstersController } from './monsters.controller'
import { MonstersService } from './monsters.service'
import { MonstersEntity } from './entities/monsters.entity'
import { UserEntity } from 'src/user/entities/user.entity'
import { CharactersEntity } from 'src/user/entities/characters.entity'
import { StatsEntity } from 'src/user/entities/stats.entity'
import { SlackService } from 'src/slack/slack.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonstersEntity,
      UserEntity,
      CharactersEntity,
      StatsEntity,
    ]),
  ],
  controllers: [MonstersController],
  providers: [MonstersService, SlackService],
  exports: [MonstersService],
})
export class MonstersModule {}
