import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  petId: string;

  @Column()
  petName: string;

  @Column()
  petImageUrl?: string;

  @Column()
  birthYear: number;

  @Column()
  gender: '남' | '여';

  @Column()
  mealCount: number;

  @Column()
  walkCount: number;

  @Column()
  bathCount: number;

  @Column()
  treatCount: number;
}
