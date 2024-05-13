import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet/entities/pet.entity';
import { PetService } from './pet/pet.service';
import { PetController } from './pet/pet.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { Verification } from './pet/entities/verification.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Pet, Verification],
      synchronize: true,
      charset: 'utf8mb4',
    }),
    TypeOrmModule.forFeature([Pet, Verification]),
  ],
  providers: [PetService, AuthService],
  controllers: [PetController, AuthController],
})
export class AppModule {}
