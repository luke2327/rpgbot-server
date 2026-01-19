import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('monsters')
export class MonstersEntity {
  @PrimaryGeneratedColumn({ name: 'monster_id' })
  monsterId: number

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string

  @Column({ name: 'hp', type: 'int', nullable: false, default: 50 })
  hp: number

  @Column({ name: 'attack', type: 'int', nullable: false, default: 10 })
  attack: number

  @Column({ name: 'defense', type: 'int', nullable: false, default: 5 })
  defense: number

  @Column({ name: 'exp', type: 'int', nullable: false, default: 10 })
  exp: number

  @Column({ name: 'level', type: 'int', nullable: false, default: 1 })
  level: number

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null

  @Column({ name: 'name_en', type: 'varchar', length: 100, nullable: true })
  nameEn: string | null

  @Column({ name: 'simple_text', type: 'text', nullable: true })
  simpleText: string | null

  @Column({ name: 'card_description', type: 'text', nullable: true })
  cardDescription: string | null

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
}
