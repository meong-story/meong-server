import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDTO } from './dto/user-response.dto';

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

  async findOneById(kakaoId: string): Promise<UserResponseDTO | undefined> {
    const user: User = await this.userRepository.findOne({
      where: { kakaoId },
    });
    if (!user) {
      return new UserResponseDTO(
        'Invalid user id!',
        user.kakaoId,
        user.name,
        user.imageUrl,
        user.petId,
      );
    }
    return new UserResponseDTO(
      'User data retrieved successfully',
      user.kakaoId,
      user.name,
      user.imageUrl,
      user.petId,
    );
  }

  async updateUserInfo(kakaoId: string, userInfo: User): Promise<void> {
    await this.userRepository.update({ kakaoId }, userInfo);
  }

  async addPetToUser(kakaoId: string, petId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { kakaoId } });
    if (user) {
      user.petId = petId;
      await this.userRepository.save(user);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
