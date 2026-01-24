import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { v4 as uuidv4 } from 'uuid'
import { UserEntity } from 'src/entities/user.entity'
import { SaveUserDto } from 'src/dtos/save-user.dto'
import { CharactersEntity } from 'src/entities/characters.entity'
import { StatsEntity } from 'src/entities/stats.entity'
import { kakaoTemplate } from 'src/libs/kakao.utils'
import { SlackService } from 'src/slack/slack.service'
import { slackChannel } from 'src/constants/slack-channel'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly slackService: SlackService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find()
  }

  findOne(kakaoUserId: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ kakaoUserId })
  }

  async remove(kakaoUserId: string): Promise<void> {
    await this.usersRepository.delete(kakaoUserId)
  }

  async saveUser(body: SaveUserDto) {
    const { id: kakaoUserId } = body.userRequest.user
    const { job, sex } = body.action.clientExtra

    await this.dataSource.transaction(async (manager) => {
      // 유저 생성 (UUID 수동 생성 필요 - PrimaryColumn 사용)
      const user = manager.create(UserEntity, {
        userId: uuidv4(),
        kakaoUserId,
      })
      await manager.save(user)

      const character = manager.create(CharactersEntity, {
        userId: user.userId, // 생성된 user의 PK 사용
        job,
        sex,
      })
      await manager.save(character)

      const stat = manager.create(StatsEntity, {
        characterId: character.characterId,
      })
      await manager.save(stat)

      const result = {
        kakaoUserId,
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

  // 매일 00시에 모든 캐릭터의 HP를 max로 복구
  @Cron('0 0 * * *', {
    timeZone: 'Asia/Seoul',
  })
  async resetAllCharactersHp() {
    try {
      // HP를 hp_max로 복구하는 쿼리
      const result = await this.dataSource.query(`
        UPDATE stats
        SET hp_current = hp_max
        WHERE hp_current < hp_max
      `)

      const updatedCount = result.affectedRows || 0

      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🌅 [자동 HP 복구]\n${updatedCount}명의 캐릭터 HP가 복구되었습니다.`,
      })
    } catch (error) {
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `❌ [HP 복구 실패]\n${error.message}`,
      })
    }
  }
}
