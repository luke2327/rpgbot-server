import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { CharactersEntity } from './characters.entity'

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ name: 'kakao_user_id', type: 'varchar', length: 100 })
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
