import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import uuid from 'uuid'
import { UserEntity } from './entities/user.entity'
import { SaveUserDto } from './dto/saveUser.dto'
import { CharactersEntity } from './entities/characters.entity'
import { StatsEntity } from './entities/stats.entity';
import { kakaoTemplate } from '../libs/kakao.utils';
import { SlackService } from '../slack/slack.service';
import { slackChannel } from '../constants/slack-channel';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>, // UserRepository 주입
    private readonly dataSource: DataSource,
    private readonly slackService: SlackService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find()
  }

  findOne(userId: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ userId })
  }

  async remove(userId: string): Promise<void> {
    await this.usersRepository.delete(userId)
  }

  async saveUser(body: SaveUserDto) {
    const { id: kakaoUserId } = body.userRequest.user
    const { botUserKey: kakaoBotUserKey } = body.userRequest.user.properties
    const { job, sex } = body.action.clientExtra
    const userId = uuid.v7()

    await this.dataSource.transaction(async (manager) => {
      // 유저 생성
      const user = manager.create(UserEntity, {
        userId,
        kakaoUserId,
        kakaoBotUserKey,
      })
      await manager.save(user)

      const character = manager.create(CharactersEntity, {
        userId,
        job,
        sex,
      })
      await manager.save(character)

      const stat = manager.create(StatsEntity, {
        characterId: character.characterId
      })
      await manager.save(stat)

      const result = {
        userId,
        kakaoUserId,
        kakaoBotUserKey,
        job,
        sex,
      }

      await this.slackService.web.chat.postMessage({
        channel: slackChannel.joinChannel,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '신규유저가입',
            },
          },
          {
            type: 'section',
            text: {
              text: `\`\`\`${JSON.stringify(result, null, 2)}\`\`\``,
              type: 'mrkdwn',
            },
          },
        ],
      })
    })

    return kakaoTemplate.simpleText('유저 저장 완료')
  }
}
