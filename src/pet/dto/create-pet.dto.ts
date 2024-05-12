export class CreatePetDto {
  name: string;
  imageUrl?: string;
  gender: '남' | '여';
  birthYear: number;
}
