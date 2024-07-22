export class CreateVerificationPostDto {
  type: 'walk' | 'meal' | 'treat' | 'bath' | 'daily';
  verificationOption?: string;
  imageUrl?: string;
  comment?: string;
}
