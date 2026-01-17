import { Controller, Post, Body } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import { BattleRequest, BattleResult } from './dto/battle.dto'

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Post('battle')
  async battle(@Body() body: BattleRequest): Promise<BattleResult> {
    const { characterId, monsterId } = body
    return await this.monstersService.battle(characterId, monsterId)
  }
}
