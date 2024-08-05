import { UserService } from './../user/user.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/createPet.dto';
import { Request, Response } from 'express';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('pet')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UseGuards(JwtAccessTokenGuard)
  async createPet(
    @Body() createPetDto: CreatePetDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const pet = await this.petService.createPet(createPetDto);

    await this.userService.addPetToUser(req.user.kakaoId, pet.id);
    res.json({
      message: '애완동물 등록 성공',
      data: pet,
    });
  }

  @Get('info')
  @UseGuards(JwtAccessTokenGuard)
  async getPetInfo(@Param('petId') petId: string, @Res() res: Response) {
    const pet = await this.petService.findOneById(petId);

    res.json({
      message: 'Get pet information successfully!',
      data: pet,
    });
  }

  @Get()
  findAll() {
    console.log('read all');
    return this.petService.findAll();
  }
}
