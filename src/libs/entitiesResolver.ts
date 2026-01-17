import { CharactersEntity } from 'src/user/entities/characters.entity'
import { StatsEntity } from 'src/user/entities/stats.entity'
import { UserEntity } from 'src/user/entities/user.entity'
import { MonstersEntity } from 'src/monsters/entities/monsters.entity'

export const entitiesResolver = () => {
  return [UserEntity, StatsEntity, CharactersEntity, MonstersEntity]
}
