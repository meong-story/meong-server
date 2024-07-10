import { User } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Pet } from '../../pet/entities/pet.entity';

@Entity()
export class VerificationPost {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  petId: string;

  @OneToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column()
  author: string;

  @OneToOne(() => Pet)
  @JoinColumn({ name: 'author' })
  user: User;

  @Column()
  verificationOption?: string;

  @Column()
  comment?: string;

  @Column()
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
