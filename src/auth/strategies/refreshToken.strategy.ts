import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log(request.cookies);
          return request?.cookies?.access_token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: AccessTokenPayload) {
    req.user = payload;
    return payload;
  }
}
