import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/createPet.dto';
import { UpdatePetDto } from './dto/updatePet.dto';

@Controller('v1/api')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post('signin')
  createPet(@Body() createPetDto: CreatePetDto) {
    return this.petService.createPet(createPetDto);
  }

  @Get()
  findAll() {
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
