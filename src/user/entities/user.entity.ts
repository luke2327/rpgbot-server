import { uuidTransformer } from 'src/libs/utils'
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { CharactersEntity } from './characters.entity'

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    transformer: uuidTransformer,
  })
  userId: string

  @Column({ name: 'kakao_user_id', type: 'varchar', nullable: false })
  kakaoUserId: string

  @Column({ name: 'kakao_bot_user_key', type: 'varchar', nullable: false })
  kakaoBotUserKey: string

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  // FK
  @OneToMany(() => CharactersEntity, (character) => character.user)
  characters: CharactersEntity[]
}
