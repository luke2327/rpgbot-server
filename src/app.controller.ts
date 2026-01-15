import { Body, Controller, Get, Header, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { JoinUserDTO } from './dtos/joinUserDto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello()
  }

  @Post('/test')
  getTest(): any {
    return this.appService.getTest()
  }

  @Post('/join-user')
  postJoinUser(@Body() joinUserDTO: JoinUserDTO) {
    return this.appService.postJoinUser(joinUserDTO)
  }

  @Get('/health')
  getHealth(): string {
    return 'OK'
  }

  @Get('/version')
  getVersion(): string {
    return '1.0.0'
  }

  @Post('/show-my-id')
  postShowMyId(@Body() body: unknown) {
    return this.appService.postShowMyId(body)
  }

  @Post('/join')
  async joinUser(@Body() body: any) {
    return this.appService.joinUser(body)
  }
}
