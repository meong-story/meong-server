import { UpdatePetDto } from './dto/update-pet.dto';
import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';
import { PetInfo } from './vo/petInfo.vo';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
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

    await this.verificationRepository.save(newVerification);

    return '애완동물 등록 성공!';
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

  async getVerificationById(petId: string): Promise<Verification> {
    return await this.verificationRepository.findOne({ where: { petId } });
  }

  async getPetInfoById(id: string): Promise<PetInfo> {
    try {
      const [verificationInfo, petInfo] = await Promise.all([
        this.verificationRepository.findOne({
          where: { petId: id },
        }),
        this.petRepository.findOne({ where: { id } }),
      ]);
      if (!petInfo) {
        throw new Error(`Pet with id: ${id} is not found!`);
      }

      const petInfoWithVerification: PetInfo = {
        id,
        name: petInfo.name,
        imageUrl: petInfo.imageUrl,
        verification: verificationInfo
          ? {
              mealCount: verificationInfo.mealCount,
              walkCount: verificationInfo.walkCount,
              bathCount: verificationInfo.bathCount,
              treatCount: verificationInfo.treatCount,
            }
          : null,
      };

      return petInfoWithVerification;
    } catch (error) {
      throw new Error(`Failed to get pet info for ID ${id}: ${error.message}`);
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
