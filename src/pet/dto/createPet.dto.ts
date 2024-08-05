export class CreatePetDto {
  name: string;
  imageUrl?: string;
  gender: 'M' | 'F';
  birthYear: number;
}
