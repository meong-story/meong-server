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
    return await this.userRepository.findOne({ where: { kakaoId } });
  }

  async updateUserInfo(kakaoId: string, userInfo: User): Promise<void> {
    await this.userRepository.update({ kakaoId }, userInfo);
  }

  async addPetToUser(kakaoId: string, petId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { kakaoId } });
    if (user) {
      user.petIds = [...(user.petIds || []), petId];
      await this.userRepository.save(user);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
