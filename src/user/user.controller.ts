import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { SaveUserDto } from './dto/saveUser.dto'
import { LoggerService } from 'src/logger'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserController.name)
  }

  @Post('find-all') // 명확히 POST로, 경로 'find-all'
  async findAllUsers(@Body() body?: any) {
    // 메서드 이름도 명확히
    this.logger.log(`받은 body: ${JSON.stringify(body)}`, { method: 'findAllUsers' })
    return this.userService.findAll() // 서비스 호출
  }

  @Post('save')
  async saveUser(@Body() body: SaveUserDto) {
    return this.userService.saveUser(body)
  }
}
