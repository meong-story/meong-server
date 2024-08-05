import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationPost } from './entities/verificationPost.entity';
import { CreateVerificationPostDto } from './dto/createVerificationPost.dto';
import { VerificationCount } from './entities/verificationCount.entity';
import { InfiniteScrollSlideResponse } from './dto/infiniteScrollSlideResponse.dto';
import { InfiniteScrollGridResponse } from './dto/infiniteScrollGiidResponse.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationPost)
    private readonly verificationPostRepository: Repository<VerificationPost>,
    @InjectRepository(VerificationCount)
    private readonly verificationCountRepository: Repository<VerificationCount>,
    private readonly userService: UserService,
  ) {}

  async createPost(
    kakaoId: string,
    createVerificationPost: CreateVerificationPostDto,
  ): Promise<void> {
    const newPost = new VerificationPost();
    const user = await this.userService.findOneById(kakaoId);
    newPost.petId = user.petId;
    newPost.author = kakaoId;

    await this.verificationPostRepository.save(newPost);
    const postCount = await this.verificationCountRepository.findOne({
      where: { petId: user.petId },
    });
    postCount[createVerificationPost.type] += 1;

    await this.verificationCountRepository.save(postCount);
  }

  async findAll() {
    return await this.verificationPostRepository.find();
  }

  async getVerificationByPetId(id: string): Promise<VerificationCount> {
    const user = await this.userService.findOneById(id);
    return await this.verificationCountRepository.findOne({
      where: { id: user.petId },
    });
  }

  async remove(id: string): Promise<VerificationPost> {
    try {
      const deletedVerification = await this.verificationPostRepository.delete({
        id,
      });
      return deletedVerification.raw;
    } catch (error) {
      throw new Error(
        `Failed to remove verification with id ${id}: ${error.message}`,
      );
    }
  }
  async getSlide(
    kakaoId: string,
    currentPage: number,
  ): Promise<InfiniteScrollSlideResponse> {
    const pageSize = 10;
    if (currentPage < 1) {
      currentPage = 1;
    }

    const [posts, totalItems] =
      await this.verificationPostRepository.findAndCount({
        where: { author: kakaoId },
        order: { createdAt: 'DESC' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      items: posts.reverse(),
    };
  }
  async getGrid(currentPage: number): Promise<InfiniteScrollGridResponse> {
    const pageSize = 30;
    const [posts, totalItems] =
      await this.verificationPostRepository.findAndCount({
        order: { createdAt: 'DESC' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      items: posts.reverse(),
    };
  }
}
