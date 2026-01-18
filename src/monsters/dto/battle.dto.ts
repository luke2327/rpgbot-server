export interface BattleTurn {
  attacker: 'character' | 'monster'
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
