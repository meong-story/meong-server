import { UpdatePetDto } from './dto/update-pet.dto';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<string> {
    const newPet = new Pet();
    newPet.name = createPetDto.name;
    newPet.birthYear = createPetDto.birthYear;
    newPet.gender = createPetDto.gender;
    newPet.imageUrl = createPetDto.imageUrl ?? 'none';

    const savedPet = await this.petRepository.save(newPet);

    const newVerification = new Verification();
    newVerification.petId = savedPet.id;

    await this.petRepository.save(newVerification);

    return '애완동물 등록 성공!';
  }

  async findAll() {
    return await this.petRepository.find();
  }

  async findOne(id: string): Promise<Pet> {
    return this.petRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneById(id: string): Promise<Pet> {
    return await this.petRepository.findOne({ where: { id } });
  }

  update(id: string, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: string) {
    return `This action removes a #${id} pet`;
  }
}
