import { UpdatePetDto } from './dto/updatePet.dto';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/createPet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';

import { Repository } from 'typeorm';
import { VerificationCount } from 'src/verification/entities/verificationCount.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(VerificationCount)
    private readonly verificationRepository: Repository<VerificationCount>,
  ) {}

  async createPet(createPetDto: CreatePetDto): Promise<CreatePetDto> {
    const newPet = new Pet();
    newPet.name = createPetDto.name;
    newPet.birthYear = createPetDto.birthYear;
    newPet.gender = createPetDto.gender;
    newPet.imageUrl = createPetDto.imageUrl ?? 'none';

    const savedPet = await this.petRepository.save(newPet);

    const newVerification = new VerificationCount();
    newVerification.petId = savedPet.id;

    await this.verificationRepository.save(newVerification);

    return newPet;
  }

  async findAll() {
    return await this.petRepository.find();
  }

  async findOneById(id: string): Promise<Pet> {
    return await this.petRepository.findOne({ where: { id } });
  }

  async update(id: string, updatedPet: UpdatePetDto) {
    try {
      await this.petRepository.update({ id }, updatedPet);
      return { message: `Pet with ID ${id} has been updated.`, updatedPet };
    } catch (error) {
      throw new Error(`Failed to remove pet with id ${id}: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Pet> {
    try {
      const deletedPet = await this.petRepository.delete({ id });
      console.log(deletedPet);
      return deletedPet.raw;
    } catch (error) {
      throw new Error(`Failed to remove pet with id ${id}: ${error.message}`);
    }
  }

  async setVerificationCountIncreasementByType(id: string, type: string) {
    try {
      const newVerification = await this.verificationRepository.findOne({
        where: { petId: id },
      });
      newVerification[type]++;
      if (newVerification) {
        await this.verificationRepository.update(
          { petId: id },
          newVerification,
        );
        return {
          message: `Verification with ID ${id} has been updated.`,
        };
      } else {
        throw new Error(`Failed to get verification info with petId`);
      }
    } catch (error) {
      throw new Error(`Error!: ${error.message}`);
    }
  }
}
