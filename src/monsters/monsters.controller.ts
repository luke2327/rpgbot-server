import { Controller, Post, Body, Get } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import type { KakaoBattleRequestDto } from './dto/kakao-battle.dto'
import type { BattleResult } from './dto/battle.dto'
import type { MonstersEntity } from './entities/monsters.entity'
import { kakaoTemplate } from 'src/libs/kakao.utils'
import { SlackService } from 'src/slack/slack.service'
import { slackChannel } from 'src/constants/slack-channel'

@Controller('monsters')
export class MonstersController {
  constructor(
    private readonly monstersService: MonstersService,
    private readonly slackService: SlackService,
  ) {}

  @Get('list')
  async findAll(): Promise<MonstersEntity[]> {
    return this.monstersService.findAll()
  }

  @Post('info')
  async getMonsterInfo(@Body() body: KakaoBattleRequestDto) {
    try {
      // Slack 로그: 전체 요청 데이터 (블록 ID 확인용)
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🔍 [몬스터 정보 조회 - 전체 요청]\n\`\`\`${JSON.stringify(body, null, 2)}\`\`\``,
      })

      // 카카오 챗봇 요청에서 monster_id 추출
      const monsterIdStr = body.action?.clientExtra?.monster_id || body.action?.detailParams?.monster_id || '1'
      const monsterId = parseInt(monsterIdStr)

      // Slack 로그
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🔍 [몬스터 정보 조회]\nmonsterId: ${monsterId}`,
      })

      if (!monsterId || isNaN(monsterId)) {
        throw new Error('monsterId가 유효하지 않습니다')
      }

      // 몬스터 정보 조회
      const monster = await this.monstersService.findOne(monsterId)

      if (!monster) {
        return kakaoTemplate.simpleText('몬스터를 찾을 수 없습니다.')
      }

      // 몬스터 카드 반환 (DB 데이터 기반)
      const cardTitle = monster.nameEn
        ? `${monster.name} / ${monster.nameEn}`
        : monster.name

      return {
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: monster.simpleText || `【${monster.name}】 (Lv.${monster.level})\n몬스터 체력: ${monster.hp} / ${monster.hp} HP`,
                extra: {},
              },
            },
            {
              basicCard: {
                title: cardTitle,
                description: monster.cardDescription || `HP: ${monster.hp} / ${monster.hp}\n공격력: ${monster.attack} | 방어력: ${monster.defense}`,
                thumbnail: {
                  imageUrl: monster.imageUrl || 'http://k.kakaocdn.net/dn/default/monster.jpg',
                  link: {
                    web: '',
                  },
                  fixedRatio: true,
                  altText: '',
                },
                buttons: [
                  {
                    label: '싸우기!',
                    action: 'block',
                    blockId: this.getBattleBlockId(),
                    extra: {
                      monster_id: monsterId.toString(),
                    },
                  },
                  {
                    label: '도망가기',
                    action: 'block',
                    blockId: '6964bc33e614ff1a2efc44b3',
                  },
                ],
              },
            },
          ],
        },
      }
    } catch (error) {
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `❌ [몬스터 정보 조회 에러]\n\`\`\`${error.message}\n\n${error.stack}\`\`\``,
      })

      return kakaoTemplate.simpleText(
        `몬스터 정보 조회 중 오류가 발생했습니다.\n${error.message}`,
      )
    }
  }

  @Post('battle')
  async battle(@Body() body: KakaoBattleRequestDto) {
    try {
      // Slack 로그: 요청 받음
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `🎮 [전투 요청]\n\`\`\`${JSON.stringify(body, null, 2)}\`\`\``,
      })

      // 카카오 챗봇 요청에서 데이터 추출
      const kakaoUserId = body.userRequest?.user?.id
      const monsterIdStr = body.action?.clientExtra?.monster_id || body.action?.detailParams?.monster_id || ''
      const monsterId = parseInt(monsterIdStr)

      // Slack 로그: 파싱 결과
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `✅ [파싱 완료]\nkakaoUserId: ${kakaoUserId}\nmonsterId: ${monsterId}`,
      })

      if (!kakaoUserId) {
        throw new Error('kakaoUserId가 없습니다')
      }
      if (!monsterId || isNaN(monsterId)) {
        throw new Error('monsterId가 유효하지 않습니다')
      }

      const battleResult = await this.monstersService.battleByKakaoUser(
        kakaoUserId,
        monsterId,
      )

      // Slack 로그: 전투 결과
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `⚔️ [전투 완료]\n승리: ${battleResult.victory ? '✅' : '❌'}\n\`\`\`${JSON.stringify(battleResult, null, 2)}\`\`\``,
      })

      // 전투 과정을 텍스트로 변환
      const battleLog = this.formatBattleLog(battleResult)

      // 승리 시 다음 몬스터로 이동하는 버튼 추가
      if (battleResult.victory) {
        const nextMonsterId = monsterId + 1

        return kakaoTemplate.textCard({
          title: '⚔️ 전투 결과',
          description: battleLog,
          buttons: [
            {
              action: 'block',
              label: '더 들어가기',
              blockId: this.getMonsterInfoBlockId(), // 몬스터 정보 조회 블록으로 이동
              extra: {
                monster_id: nextMonsterId.toString(),
              },
            },
            {
              action: 'block',
              label: '도망가기',
              blockId: '6964bc33e614ff1a2efc44b3',
            },
          ],
        })
      } else {
        // 패배 시 단순 텍스트로 반환
        return kakaoTemplate.simpleText(battleLog)
      }
    } catch (error) {
      // Slack 로그: 에러
      await this.slackService.web.chat.postMessage({
        channel: slackChannel.botTest,
        text: `❌ [전투 에러]\n\`\`\`${error.message}\n\n${error.stack}\`\`\``,
      })

      return kakaoTemplate.simpleText(
        `전투 중 오류가 발생했습니다.\n${error.message}`,
      )
    }
  }

  // 몬스터 정보 조회 블록 ID
  private getMonsterInfoBlockId(): string {
    // TODO: 카카오톡에서 "몬스터 정보 표시" 블록 생성 후 여기에 블록 ID 입력
    return 'MONSTER_INFO_BLOCK_ID' // 예: '6964xxxxxxxxxxxx'
  }

  // 전투 블록 ID
  private getBattleBlockId(): string {
    return '6964d85ae614ff1a2efc47df'
  }

  private formatBattleLog(result: BattleResult): string {
    let log = '⚔️ 전투 시작!\n\n'

    // 턴별 로그
    result.turns.forEach((turn, index) => {
      const turnNum = Math.floor(index / 2) + 1
      if (turn.attacker === 'character') {
        log += `[턴 ${turnNum}] 🗡️ 당신의 공격! ${turn.damage} 데미지!\n`
        log += `   몬스터 HP: ${turn.targetHp}\n\n`
      } else {
        log += `[턴 ${turnNum}] 👹 몬스터 공격! ${turn.damage} 데미지!\n`
        log += `   내 HP: ${turn.targetHp}\n\n`
      }
    })

    // 결과
    if (result.victory) {
      log += '🎉 승리!\n\n'
      log += `💰 획득 보상:\n`
      log += `   경험치: +${result.rewards?.exp}\n`
      log += `   골드: +${result.rewards?.gold}\n\n`
      log += `남은 HP: ${result.characterFinalHp}`
    } else {
      log += '💀 패배...\n\n'
      log += `HP가 1로 회복되었습니다.`
    }

    return log
  }
}
