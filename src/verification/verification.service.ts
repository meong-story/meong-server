import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationPost } from './entities/verificationPost.entity';
import { CreateVerificationPostDto } from './dto/createVerificationPost.dto';
import { VerificationCount } from './entities/verificationCount.entity';
import { CreateVerificationPostResponseDto } from './dto/createVerificationPostResponse.dto';
import { InfiniteScrollSlideResponse } from './dto/infiniteScrollSlideResponse.dto';
import { InfiniteScrollGridResponse } from './dto/infiniteScrollGiidResponse.dto';

@Injectable()
export class VerificationService {
  @InjectRepository(VerificationPost)
  private readonly verificationPostRepository: Repository<VerificationPost>;
  @InjectRepository(VerificationCount)
  private readonly verificationCountRepository: Repository<VerificationCount>;

  async createPost(
    type: string,
    createVerificationPost: CreateVerificationPostDto,
  ): Promise<CreateVerificationPostResponseDto> {
    const newPost = new VerificationPost();
    newPost.petId = createVerificationPost.petId;

    await this.verificationPostRepository.save(newPost);
    const postCount = await this.verificationCountRepository.findOne({
      where: { petId: createVerificationPost.petId },
    });
    postCount[type] += 1;
    await this.verificationCountRepository.save(postCount);
    const res = new CreateVerificationPostResponseDto(
      '인증 포스트 추가 완료!',
      createVerificationPost,
    );
    return res;
  }

  async findAll() {
    return await this.verificationPostRepository.find();
  }

  async getVerificationByPetId(petId: string): Promise<VerificationCount> {
    return await this.verificationCountRepository.findOne({ where: { petId } });
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
  async getSlide(currentPage: number): Promise<InfiniteScrollSlideResponse> {
    const pageSize = 10;
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
