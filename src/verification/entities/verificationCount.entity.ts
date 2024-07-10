import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Pet } from '../../pet/entities/pet.entity';

@Entity()
export class VerificationCount {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  petId: string;

  @OneToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ default: 0 })
  meal: number;

  @Column({ default: 0 })
  walk: number;

  @Column({ default: 0 })
  bath: number;

  @Column({ default: 0 })
  treat: number;
}
