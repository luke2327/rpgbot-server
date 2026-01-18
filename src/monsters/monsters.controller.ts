import { Controller, Post, Body } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import { kakaoTemplate } from 'src/libs/kakao.utils'

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Post('battle')
  async battle(@Body() body: any) {
    // 카카오 챗봇에서 오는 데이터
    const { action } = body
    // const kakaoUserId = body.userRequest.user.id // TODO: 나중에 사용
    const monsterId = Number(action.extra.monster_id)

    // TODO: kakaoUserId로 캐릭터 조회
    // 임시로 characterId = 1 사용
    const characterId = 1

    // 전투 실행
    const result = await this.monstersService.battle(characterId, monsterId)

    // 전투 로그 생성
    let battleLog = '⚔️ 전투 시작!\n\n'

    result.turns.forEach((turn, index) => {
      if (turn.attacker === 'character') {
        battleLog += `${index + 1}턴: 공격! 💥 ${turn.damage} 데미지!\n`
        battleLog += `→ 몬스터 HP: ${turn.targetHp}\n\n`
      } else {
        battleLog += `${index + 1}턴: 몬스터 반격! 🔥 ${turn.damage} 데미지!\n`
        battleLog += `→ 내 HP: ${turn.targetHp}\n\n`
      }
    })

    // 결과 메시지
    if (result.victory) {
      battleLog += `\n✨ 승리! ✨\n`
      battleLog += `💰 골드 +${result.rewards?.gold || 0}\n`
      battleLog += `✨ 경험치 +${result.rewards?.exp || 0}\n`
      battleLog += `❤️ 남은 HP: ${result.characterFinalHp}`
    } else {
      battleLog += `\n💀 패배...\n`
      battleLog += `HP가 1로 복구되었습니다.`
    }

    return kakaoTemplate.simpleText(battleLog)
  }
}
