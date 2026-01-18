import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, EntityManager } from 'typeorm'
import { MonstersEntity } from './entities/monsters.entity'
import { CharactersEntity } from 'src/user/entities/characters.entity'
import { StatsEntity } from 'src/user/entities/stats.entity'
import { UserEntity } from 'src/user/entities/user.entity'
import { BattleResult, BattleTurn } from './dto/battle.dto'
import { SlackService } from 'src/slack/slack.service'
import { slackChannel } from 'src/constants/slack-channel'

@Injectable()
export class MonstersService {
  constructor(
    @InjectRepository(MonstersEntity)
    private monstersRepository: Repository<MonstersEntity>,
    private dataSource: DataSource,
    private slackService: SlackService,
  ) {}

  // 모든 몬스터 조회
  async findAll(): Promise<MonstersEntity[]> {
    return this.monstersRepository.find()
  }

  // 카카오 유저 ID로 전투 시작 (카카오 챗봇용)
  async battleByKakaoUser(
    kakaoUserId: string,
    monsterId: number,
  ): Promise<BattleResult> {
    return await this.dataSource.transaction(async (manager) => {
      // 카카오 유저 ID로 유저 찾기
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🔍 [유저 조회]\nkakaoUserId: ${kakaoUserId}`,
      })

      const user = await manager.findOne(UserEntity, {
        where: { kakaoUserId },
      })

      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `${user ? '✅' : '❌'} [유저 조회 결과]\n\`\`\`${JSON.stringify(user, null, 2)}\`\`\``,
      })

      if (!user) {
        throw new NotFoundException(
          `User with kakao ID ${kakaoUserId} not found`,
        )
      }

      // 해당 유저의 캐릭터 찾기 (첫 번째 캐릭터 사용)
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🔍 [캐릭터 조회]\nuserId: ${user.kakaoUserId}`,
      })

      const character = await manager.findOne(CharactersEntity, {
        where: { userId: user.kakaoUserId },
      })

      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `${character ? '✅' : '❌'} [캐릭터 조회 결과]\n\`\`\`${JSON.stringify(character, null, 2)}\`\`\``,
      })

      if (!character) {
        throw new NotFoundException(`Character for user ${user.kakaoUserId} not found`)
      }

      // 기존 battle 로직 실행
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `⚔️ [전투 로직 시작]\ncharacterId: ${character.characterId}\nmonsterId: ${monsterId}`,
      })

      return this.battle(character.characterId, monsterId, manager)
    })
  }

  // 몬스터 ID로 전투 시작 (내부 헬퍼 메서드)
  private async battle(
    characterId: number,
    monsterId: number,
    manager: EntityManager,
  ): Promise<BattleResult> {
    // 캐릭터와 스탯 조회
    const character = await manager.findOne(CharactersEntity, {
      where: { characterId },
    })
    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`)
    }

    const stats = await manager.findOne(StatsEntity, {
      where: { characterId },
    })
    if (!stats) {
      throw new NotFoundException(`Stats for character ${characterId} not found`)
    }

    // 몬스터 조회
    const monster = await manager.findOne(MonstersEntity, {
      where: { monsterId },
    })
    if (!monster) {
      throw new NotFoundException(`Monster with ID ${monsterId} not found`)
    }

    // 전투 시작
    let characterHp = stats.hpCurrent
    let monsterHp = monster.hp

    const turns: BattleTurn[] = []
    let isCharacterTurn = true

    // 턴제 전투 (HP가 0 이하가 될 때까지)
    while (characterHp > 0 && monsterHp > 0) {
      if (isCharacterTurn) {
        // 캐릭터 공격
        const damage = this.calculateDamage(stats.str, monster.defense)
        monsterHp -= damage

        turns.push({
          attacker: 'character',
          damage,
          targetHp: Math.max(0, monsterHp),
        })
      } else {
        // 몬스터 공격
        const damage = this.calculateDamage(monster.attack, stats.dex)
        characterHp -= damage

        turns.push({
          attacker: 'monster',
          damage,
          targetHp: Math.max(0, characterHp),
        })
      }

      isCharacterTurn = !isCharacterTurn
    }

    // 전투 결과 처리
    const victory = characterHp > 0

    if (victory) {
      // 승리 시: 경험치 및 골드 획득
      character.exp += monster.exp
      character.gold += monster.exp * 2 // 골드는 경험치의 2배

      // 캐릭터 HP 업데이트
      stats.hpCurrent = characterHp

      await manager.save(character)
      await manager.save(stats)

      const result = {
        victory: true,
        turns,
        rewards: {
          exp: monster.exp,
          gold: monster.exp * 2,
        },
        characterFinalHp: characterHp,
        monsterFinalHp: 0,
      }

      // Slack 메시지 전송 (승리)
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎉 전투 승리!',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*몬스터:* ${monster.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*캐릭터 ID:* ${characterId}`,
              },
              {
                type: 'mrkdwn',
                text: `*획득 경험치:* ${monster.exp}`,
              },
              {
                type: 'mrkdwn',
                text: `*획득 골드:* ${monster.exp * 2}`,
              },
              {
                type: 'mrkdwn',
                text: `*남은 HP:* ${characterHp}`,
              },
              {
                type: 'mrkdwn',
                text: `*총 턴 수:* ${turns.length}`,
              },
            ],
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

      return result
    } else {
      // 패배 시: HP 1로 복구 (페널티)
      stats.hpCurrent = 1

      await manager.save(stats)

      const result = {
        victory: false,
        turns,
        characterFinalHp: 0,
        monsterFinalHp: monsterHp,
      }

      // Slack 메시지 전송 (패배)
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '💀 전투 패배...',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*몬스터:* ${monster.name}`,
              },
              {
                type: 'mrkdwn',
                text: `*캐릭터 ID:* ${characterId}`,
              },
              {
                type: 'mrkdwn',
                text: `*남은 몬스터 HP:* ${monsterHp}`,
              },
              {
                type: 'mrkdwn',
                text: `*총 턴 수:* ${turns.length}`,
              },
            ],
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

      return result
    }
  }

  // 데미지 계산 (스탯 기반)
  private calculateDamage(attack: number, defense: number): number {
    // 공격력 - 방어력의 10% + 랜덤(0~5)
    const baseDamage = attack - defense * 0.1
    const randomBonus = Math.floor(Math.random() * 6) // 0~5
    return Math.max(1, Math.floor(baseDamage + randomBonus)) // 최소 1 데미지
  }
}
