import { Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/test')
  getTest(someValue: any): any {
    return this.appService.getTest(someValue);
  }

  @Post('/join-user')
  postJoinUser() {
    return this.appService.postJoinUser();
  }

  @Get('/health')
  getHealth(): string {
    return 'OK';
  }

  @Get('/version')
  getVersion(): string {
    return '1.0.0';
  }
}
