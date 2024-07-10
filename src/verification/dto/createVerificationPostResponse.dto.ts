import { CreateVerificationPostDto } from './createVerificationPost.dto';

export class CreateVerificationPostResponseDto {
  msg: string;
  data: {
    verificationOption?: string;
    imageUrl?: string;
    comment?: string;
  };
  constructor(
    msg: string,
    createVerificationPostDto: CreateVerificationPostDto,
  ) {
    this.msg = msg;
    this.data = {};

    if (createVerificationPostDto.verificationOption) {
      this.data.verificationOption =
        createVerificationPostDto.verificationOption;
    }

    if (createVerificationPostDto.imageUrl) {
      this.data.imageUrl = createVerificationPostDto.imageUrl;
    }

    if (createVerificationPostDto.comment) {
      this.data.comment = createVerificationPostDto.comment;
    }
  }
}
