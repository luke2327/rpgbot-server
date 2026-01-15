import { Injectable } from '@nestjs/common'
import { WebClient } from '@slack/web-api'
import { env } from 'src/configs/env'

@Injectable()
export class SlackService {
  public web: WebClient

  constructor() {
    this.web = new WebClient(env.SLACK_TOKEN)
  }
}
