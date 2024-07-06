export class CreateVerificationPostDto {
  id: string;
  petId: string;
  verificationOption?: string;
  imageUrl?: string;
  comment?: string;
}
