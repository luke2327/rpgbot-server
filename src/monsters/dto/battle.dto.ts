export class BattleRequest {
  characterId: number
  monsterId: number
}

export interface BattleTurn {
  attacker: string // 'character' or 'monster'
  damage: number
  targetHp: number
}

export interface BattleResult {
  victory: boolean
  turns: BattleTurn[]
  rewards?: {
    exp: number
    gold: number
  }
  characterFinalHp: number
  monsterFinalHp: number
}
