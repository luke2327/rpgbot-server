import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { CharacterEntity } from './character.entity'

@Entity('stats') // DB 테이블 이름 'stats'
export class StatEntity {
  @PrimaryGeneratedColumn()
  statsId: number

  @Column({ type: 'int', nullable: false })
  characterId: number // characters 테이블의 characterId와 연결

  @Column({ type: 'int', default: 100 })
  hpCurrent: number // 현재 HP

  @Column({ type: 'int', default: 100 })
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
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  // 이 스탯이 어떤 캐릭터의 것인지 연결 (1:1 관계)
  @OneToOne(() => CharacterEntity)
  @JoinColumn({ name: 'characterId' })
  character: CharacterEntity
}
