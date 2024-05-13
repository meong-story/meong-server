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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
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

  @Get('/verification/:id')
  getVerificationById(@Param('id') id: string) {
    return this.petService.getVerificationById(id);
  }

  @Get('/petInfo/:id')
  getPetInfoById(@Param('id') id: string) {
    return this.petService.getPetInfoById(id);
  }
}
