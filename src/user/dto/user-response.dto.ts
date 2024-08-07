import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDTO {
  @ApiProperty({ description: '메시지' })
  message?: string;

  @ApiProperty({ description: '유저 이름' })
  name?: string;

  @ApiProperty({ description: '프로필 사진 URL' })
  imageUrl?: string;

  @ApiProperty({ description: '펫 아이디' })
  petId?: string;

  @ApiProperty({ description: '리프레쉬 토큰' })
  refreshToken?: string;

  constructor(
    message: string,
    name: string,
    imageUrl: string,
    petId: string,
    refreshToken: string,
  ) {
    this.message = message;
    this.name = name;
    this.imageUrl = imageUrl;
    this.petId = petId;
    this.refreshToken = refreshToken;
  }
}
