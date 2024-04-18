import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet/entities/pet.entity';
import { PetService } from './pet/pet.service';
import { PetController } from './pet/pet.controller';
import { ConfigModule } from '@nestjs/config';

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
      entities: [Pet],
      synchronize: true,
      charset: 'utf8mb4',
    }),
    TypeOrmModule.forFeature([Pet]),
  ],
  providers: [PetService],
  controllers: [PetController],
})
export class AppModule {}
