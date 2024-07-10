import { Request as Req } from 'express';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: string;
      userId?: UUID;
    };
  }
}
