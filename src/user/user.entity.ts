import { CharacterEntity } from './character.entity'
import { uuidTransformer } from '../libs/utils'
import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm'



@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
    transformer: uuidTransformer,
  })
  userId: string

  @Column({ name: 'user_name', type: 'varchar', nullable: false })
  userName: string

  @Column({
    name: 'user_name_hash',
    type: 'uuid',
    transformer: uuidTransformer,
  })
  userNameHash: string

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date   

  
}
