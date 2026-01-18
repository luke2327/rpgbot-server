import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { MonstersEntity } from './entities/monsters.entity'
import { CharactersEntity } from 'src/user/entities/characters.entity'
import { StatsEntity } from 'src/user/entities/stats.entity'
import { BattleResult, BattleTurn } from './dto/battle.dto'

@Injectable()
export class MonstersService {
  constructor(
    @InjectRepository(MonstersEntity)
    private monstersRepository: Repository<MonstersEntity>,
    private dataSource: DataSource,
  ) {}

  // 몬스터 ID로 전투 시작
  async battle(characterId: number, monsterId: number): Promise<BattleResult> {
    return await this.dataSource.transaction(async (manager) => {
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

        return {
          victory: true,
          turns,
          rewards: {
            exp: monster.exp,
            gold: monster.exp * 2,
          },
          characterFinalHp: characterHp,
          monsterFinalHp: 0,
        }
      } else {
        // 패배 시: HP 1로 복구 (페널티)
        stats.hpCurrent = 1

        await manager.save(stats)

        return {
          victory: false,
          turns,
          characterFinalHp: 0,
          monsterFinalHp: monsterHp,
        }
      }
    })
  }

  // 데미지 계산 (스탯 기반)
  private calculateDamage(attack: number, defense: number): number {
    // 공격력 - 방어력의 10% + 랜덤(0~5)
    const baseDamage = attack - defense * 0.1
    const randomBonus = Math.floor(Math.random() * 6) // 0~5
    return Math.max(1, Math.floor(baseDamage + randomBonus)) // 최소 1 데미지
  }
}
