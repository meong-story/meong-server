import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  petId: string;

  @OneToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ default: 0 })
  mealCount: number;

  @Column({ default: 0 })
  walkCount: number;

  @Column({ default: 0 })
  bathCount: number;

  @Column({ default: 0 })
  treatCount: number;
}
