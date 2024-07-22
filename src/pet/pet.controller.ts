import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/createPet.dto';
import { UpdatePetDto } from './dto/updatePet.dto';
import { Response } from 'express';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post('register')
  async createPet(@Body() createPetDto: CreatePetDto, @Res() res: Response) {
    const petInfo = await this.petService.createPet(createPetDto);
    res.json({
      message: '애완동물 등록 성공',
      data: petInfo,
    });
  }

  @Get()
  findAll() {
    console.log('read all');
    return this.petService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.petService.findOneById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedPet: UpdatePetDto) {
    return this.petService.update(id, updatedPet);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petService.remove(id);
  }
}
