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

      // 카카오 챗봇 응답 형식으로 반환
      return kakaoTemplate.simpleText(battleLog)
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
