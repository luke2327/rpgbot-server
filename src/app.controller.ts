import { Body, Controller, Get, Header, Post } from '@nestjs/common'
import { AppService } from 'src/app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('/show-my-id')
  postShowMyId(@Body() body: unknown) {
    return this.appService.postShowMyId(body)
  }

  @Post('/join')
  async joinUser(@Body() body: any) {
    return this.appService.joinUser(body)
  }

  @Post('/save-job')
  async saveJob(@Body() body: any) {
    return this.appService.saveJob(body)
  }
}
