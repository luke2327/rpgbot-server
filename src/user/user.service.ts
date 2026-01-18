import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import * as uuid from 'uuid'
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
    try {
      console.log('[saveUser] 시작 - body:', JSON.stringify(body, null, 2))

      const { id: kakaoUserId } = body.userRequest.user
      const { botUserKey: kakaoBotUserKey } = body.userRequest.user.properties
      const { job, sex } = body.action.clientExtra
      const userId = uuid.v4()

      console.log('[saveUser] 파싱 완료:', { kakaoUserId, kakaoBotUserKey, job, sex, userId })

      await this.dataSource.transaction(async (manager) => {
        console.log('[saveUser] 트랜잭션 시작')

        // 유저 생성
        console.log('[saveUser] UserEntity 생성 시도')
        const user = manager.create(UserEntity, {
          userId,
          kakaoUserId,
          kakaoBotUserKey,
        })
        console.log('[saveUser] UserEntity 생성 완료:', user)

        console.log('[saveUser] User 저장 시도')
        await manager.save(user)
        console.log('[saveUser] User 저장 완료')

        console.log('[saveUser] CharactersEntity 생성 시도')
        const character = manager.create(CharactersEntity, {
          userId,
          job,
          sex,
        })
        console.log('[saveUser] CharactersEntity 생성 완료:', character)

        console.log('[saveUser] Character 저장 시도')
        await manager.save(character)
        console.log('[saveUser] Character 저장 완료, characterId:', character.characterId)

        console.log('[saveUser] StatsEntity 생성 시도')
        const stat = manager.create(StatsEntity, {
          characterId: character.characterId
        })
        console.log('[saveUser] StatsEntity 생성 완료:', stat)

        console.log('[saveUser] Stats 저장 시도')
        await manager.save(stat)
        console.log('[saveUser] Stats 저장 완료')

        const result = {
          userId,
          kakaoUserId,
          kakaoBotUserKey,
          job,
          sex,
        }

        console.log('[saveUser] Slack 메시지 전송 시도')
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
        console.log('[saveUser] Slack 메시지 전송 완료')
      })

      console.log('[saveUser] 트랜잭션 완료')
      return kakaoTemplate.simpleText('유저 저장 완료')
    } catch (error) {
      console.error('[saveUser] 에러 발생:', error)
      throw error
    }
  }
}
