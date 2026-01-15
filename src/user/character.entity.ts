import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('characters') // DB 테이블 이름은 'characters'
export class CharacterEntity {
  @PrimaryGeneratedColumn() // 자동으로 1, 2, 3... 증가하는 ID
  characterId: number

  @Column({ type: 'varbinary', length: 16, nullable: false }) // user 테이블의 user_id와 같은 타입
  userId: Buffer // 바이너리 형태로 저장

  @Column({ type: 'enum', enum: ['warrior', 'mage'], nullable: false })
  job: 'warrior' | 'mage' // 직업은 전사나 마법사만 가능

  @Column({ type: 'enum', enum: ['male', 'female'], nullable: false })
  gender: 'male' | 'female' // 성별

  @Column({ type: 'int', default: 1 })
  level: number // 레벨, 기본 1

  @Column({ type: 'int', default: 100 })
  gold: number // 골드, 기본 100

  @Column({ type: 'int', default: 0 })
  exp: number // 경험치, 기본 0

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  // 이 캐릭터가 어떤 유저의 것인지 연결 (1:1 관계)
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity
}
