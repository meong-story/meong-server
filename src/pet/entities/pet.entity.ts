import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  imageUrl?: string;

  @Column({ nullable: false })
  birthYear: number;

  @Column({ nullable: false })
  gender: 'M' | 'F';
}
