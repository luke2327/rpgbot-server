import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { CharactersEntity } from './characters.entity'
import { uuidTransformer } from 'src/libs/utils'

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ name: 'user_id', type: 'binary', length: 16, transformer: uuidTransformer })
  userId: string

  @Column({ name: 'kakao_user_id', type: 'varchar', length: 100, unique: true })
  kakaoUserId: string

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  // FK
  @OneToMany(() => CharactersEntity, (character) => character.user)
  characters: CharactersEntity[]
}
