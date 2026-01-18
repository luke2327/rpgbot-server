import { Controller, Post, Body, Get } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import type { KakaoBattleRequestDto } from './dto/kakao-battle.dto'
import type { BattleResult } from './dto/battle.dto'
import type { MonstersEntity } from './entities/monsters.entity'
import { kakaoTemplate } from 'src/libs/kakao.utils'

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Get('list')
  async findAll(): Promise<MonstersEntity[]> {
    return this.monstersService.findAll()
  }

  @Post('battle')
  async battle(@Body() body: KakaoBattleRequestDto) {
    // 카카오 챗봇 요청에서 데이터 추출
    const kakaoUserId = body.userRequest.user.id
    const monsterId = parseInt(body.action.params.monster_id)

    const battleResult = await this.monstersService.battleByKakaoUser(
      kakaoUserId,
      monsterId,
    )

    // 전투 과정을 텍스트로 변환
    const battleLog = this.formatBattleLog(battleResult)

    // 카카오 챗봇 응답 형식으로 반환
    return kakaoTemplate.simpleText(battleLog)
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
