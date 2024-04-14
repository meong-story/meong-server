export class CreatePetDto {
  petName: string;
  petImageUrl?: string;
  gender: '남' | '여';
  birthYear: number;
}
