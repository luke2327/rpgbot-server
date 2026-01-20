import { CharactersEntity } from 'src/entities/characters.entity'
import { StatsEntity } from 'src/entities/stats.entity'
import { UserEntity } from 'src/entities/user.entity'
import { MonstersEntity } from 'src/entities/monsters.entity'
import { ErrorLogEntity } from 'src/entities/error-log.entity'

export const entitiesResolver = () => {
  return [UserEntity, StatsEntity, CharactersEntity, MonstersEntity, ErrorLogEntity]
}
