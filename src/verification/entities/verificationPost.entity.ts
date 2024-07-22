import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class VerificationPost {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  petId: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  verificationOption?: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
