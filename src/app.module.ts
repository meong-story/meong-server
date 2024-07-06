import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet/entities/pet.entity';
import { PetService } from './pet/pet.service';
import { PetController } from './pet/pet.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { VerificationPost } from './verification/entities/verificationPost.entity';
import { VerificationService } from './verification/verification.service';
import { VerificationCount } from './verification/entities/verificationCount.entity';
import { VerificationController } from './verification/verification.controller';
import { HttpModule } from '@nestjs/axios';
import { User } from './user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Pet, VerificationPost, VerificationCount, User],
      synchronize: true,
      charset: 'utf8mb4',
    }),
    TypeOrmModule.forFeature([Pet, VerificationPost, VerificationCount, User]),
  ],
  providers: [PetService, AuthService, VerificationService, JwtService],
  controllers: [PetController, AuthController, VerificationController],
})
export class AppModule {}
