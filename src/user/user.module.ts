import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from 'src/entities/user.entity'
import { CharactersEntity } from 'src/entities/characters.entity'
import { StatsEntity } from 'src/entities/stats.entity'
import { SlackService } from 'src/slack/slack.service'

@Module({
  providers: [UserService, SlackService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity, CharactersEntity, StatsEntity])],
  exports: [TypeOrmModule],
})
export class UserModule {}
