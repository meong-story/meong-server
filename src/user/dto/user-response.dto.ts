export class UserResponseDTO {
  kakaoId: string;
  name: string;
  imageUrl: string;
  petId: string;

  constructor(kakaoId: string, name: string, imageUrl: string, petId: string) {
    this.kakaoId = kakaoId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.petId = petId;
  }
}
