export interface Bot {
  id: string
  name: string
}

export interface Intent {
  id: string
  name: string
  extra: Extra
}

export interface Extra {
  reason: Reason
}

export interface Reason {
  code: number
  message: string
}

export interface Action<T> {
  id: string
  name: string
  params: Params
  detailParams: DetailParams
  clientExtra: T
}

export interface Params {
  0
}

export interface DetailParams {
  0
}

export interface UserRequest {
  block: Block
  user: User
  utterance: string
  params: Params2
  lang: string
  timezone: string
}

export interface Block {
  id: string
  name: string
}

export interface User {
  id: string
  type: string
  properties: Properties
}

export interface Properties {
  botUserKey: string
  bot_user_key: string
}

export interface Params2 {
  ignoreMe: string
  surface: string
}

export interface Flow {
  lastBlock: LastBlock
}

export interface LastBlock {
  id: string
  name: string
}
