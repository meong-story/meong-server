import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  name?: string;
  imageUrl?: string;
  gender?: '남' | '여';
  birthYear?: number;
}
