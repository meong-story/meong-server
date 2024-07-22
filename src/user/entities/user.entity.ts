import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: true })
  kakaoId?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  refreshTokenExp?: Date;

  @Column('simple-array', { nullable: true })
  petIds: string[];
}
