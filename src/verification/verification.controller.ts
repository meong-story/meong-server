import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { VerificationService } from './verification.service';
import { CreateVerificationPostDto } from './dto/createVerificationPost.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post(':type(walk|meal|treat|bath|daily)')
  createPost(
    @Param('type') type: string,
    @Body() newPost: CreateVerificationPostDto,
  ) {
    return this.verificationService.createPost(type, newPost);
  }

  @Get('post')
  @UseGuards(JwtAccessTokenGuard)
  findAll() {
    return this.verificationService.findAll();
  }

  @Get('count/:petId')
  findOneById(@Param('petId') petId: string) {
    return this.verificationService.getVerificationByPetId(petId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificationService.remove(id);
  }

  @Get('slide')
  async getSlide(@Query('currentPage') currentPage: number) {
    return await this.verificationService.getSlide(currentPage);
  }

  @Get('grid')
  async getGrid(@Query('currentPage') currentPage: number) {
    return await this.verificationService.getGrid(currentPage);
  }
}
