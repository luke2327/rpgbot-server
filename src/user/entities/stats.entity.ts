import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { CharactersEntity } from './characters.entity'

@Entity('stats') // DB 테이블 이름 'stats'
export class StatsEntity {
  @PrimaryGeneratedColumn({ name: 'stats_id' })
  statsId: number

  @Column({ name: 'character_id', type: 'int', nullable: false })
  characterId: number // characters 테이블의 characterId와 연결

  @Column({ name: 'hp_current', type: 'int', default: 100 })
  hpCurrent: number // 현재 HP

  @Column({ name: 'hp_max', type: 'int', default: 100 })
  hpMax: number // 최대 HP

  @Column({ type: 'int', default: 100 })
  str: number // 힘

  @Column({ type: 'int', default: 100 })
  dex: number // 민첩

  @Column({ type: 'int', default: 100 })
  int: number // 지능

  @Column({ type: 'int', default: 100 })
  luk: number // 행운

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  // 이 스탯이 어떤 캐릭터의 것인지 연결 (1:1 관계)
  @OneToOne(() => CharactersEntity)
  @JoinColumn({ name: 'character_id', referencedColumnName: 'characterId' })
  character: CharactersEntity
}
