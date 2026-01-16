import { Bot, Intent, UserRequest, Flow, Action } from 'src/types/kakao.type'

export class SaveUserDto {
  bot: Bot
  intent: Intent
  action: Action<{
    job: 'warrior' | 'mage'
    sex: 'male' | 'female'
  }>
  userRequest: UserRequest
  contexts: any[]
  flow: Flow
}
