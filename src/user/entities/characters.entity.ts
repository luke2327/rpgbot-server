import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { UserEntity } from './user.entity'

@Entity('characters') // DB 테이블 이름은 'characters'
export class CharactersEntity {
  @PrimaryGeneratedColumn({ name: 'character_id' }) // 자동으로 1, 2, 3... 증가하는 ID
  characterId: number

  @Column({ name: 'user_id', type: 'varchar', length: 100 })
  userId: string // 카카오 유저 ID (kakao_user_id)

  @Column({ type: 'enum', enum: ['warrior', 'mage'], nullable: false })
  job: 'warrior' | 'mage' // 직업은 전사나 마법사만 가능

  @Column({ type: 'enum', enum: ['male', 'female'], nullable: false })
  sex: 'male' | 'female' // 성별

  @Column({ type: 'int', default: 1 })
  level: number // 레벨, 기본 1

  @Column({ type: 'int', default: 100 })
  gold: number // 골드, 기본 100

  @Column({ type: 'int', default: 0 })
  exp: number // 경험치, 기본 0

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  // 이 캐릭터가 어떤 유저의 것인지 연결 (1:N 관계)
  @ManyToOne(() => UserEntity, (user) => user.characters, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'kakaoUserId' })
  user: UserEntity
}
