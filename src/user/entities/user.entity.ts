import { Entity, Column, PrimaryColumn, OneToMany, BeforeInsert } from 'typeorm'
import { CharactersEntity } from './characters.entity'
import { v4 as uuidv4 } from 'uuid'

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ name: 'user_id', type: 'binary', length: 16 })
  userId: Buffer

  @Column({ name: 'kakao_user_id', type: 'varchar', length: 100, unique: true })
  kakaoUserId: string

  @BeforeInsert()
  generateUuid() {
    if (!this.userId) {
      // UUID v4를 Buffer로 변환
      const uuid = uuidv4().replace(/-/g, '')
      this.userId = Buffer.from(uuid, 'hex')
    }
  }

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
