import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDTO {
  @ApiProperty({ description: '메시지' })
  message: string;

  @ApiProperty({ description: '액세스 토큰' })
  accessToken: string;

  constructor(accessToken: string, message: string) {
    this.message = message;
    this.accessToken = accessToken;
  }
}
