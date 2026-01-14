import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>, // UserRepository 주입
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find()
  }

  findOne(userId: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ userId })
  }

  async remove(userId: string): Promise<void> {
    await this.usersRepository.delete(userId)
  }
}
