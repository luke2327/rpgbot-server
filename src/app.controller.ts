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
  
  @Post('/my-id')
  showMyId(@Body() body: any) {
  const userId = body.userRequest?.user?.id || 'ID 없음';
  return this.appService.showMyId(userId);
  }
}
