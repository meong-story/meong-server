import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const newPet = new Pet();
    newPet.petName = createPetDto.petName;
    newPet.birthYear = createPetDto.birthYear;
    newPet.gender = createPetDto.gender;
    newPet.petImageUrl = createPetDto.petImageUrl ?? 'none';
    newPet.bathCount = 0;
    newPet.mealCount = 0;
    newPet.treatCount = 0;
    newPet.walkCount = 0;
    return await this.petRepository.save(newPet);
  }

  findAll() {
    return `This action returns all pet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
