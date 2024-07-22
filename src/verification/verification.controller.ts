import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import { VerificationService } from './verification.service';
import { CreateVerificationPostDto } from './dto/createVerificationPost.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Request, Response } from 'express';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
  async createPost(
    @Body() newPost: CreateVerificationPostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.verificationService.createPost(req.user.kakaoId, newPost);
    res.json({
      message: 'Verification created!',
    });
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll() {
    return this.verificationService.findAll();
  }

  @Get('count')
  @UseGuards(JwtAccessTokenGuard)
  async findOneById(@Req() req: Request, @Res() res: Response) {
    const verificationInfo =
      await this.verificationService.getVerificationByPetId(req.user.kakaoId);
    res.json({
      message: '펫 인증 정보',
      data: verificationInfo,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificationService.remove(id);
  }

  @Get('slide')
  @UseGuards(JwtAccessTokenGuard)
  async getSlide(
    @Query('currentPage') currentPage: number,
    @Req() req: Request,
  ) {
    return await this.verificationService.getSlide(
      req.user.kakaoId,
      currentPage,
    );
  }

  @Get('grid')
  async getGrid(@Query('currentPage') currentPage: number) {
    return await this.verificationService.getGrid(currentPage);
  }
}
