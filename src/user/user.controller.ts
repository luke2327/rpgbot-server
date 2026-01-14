import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('find-all')  // 명확히 POST로, 경로 'find-all'
  async findAllUsers(@Body() body?: any) {  // 메서드 이름도 명확히
    console.log('받은 body:', body);  // 테스트 로그
    return this.userService.findAll();  // 서비스 호출
  }
}