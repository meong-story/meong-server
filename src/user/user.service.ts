import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async createUser(): Promise<User> {
    const user = this.userRepository.create();
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(kakaoId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { kakaoId } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
