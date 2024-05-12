import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: '미지정' })
  name: string;

  @Column({ default: '' })
  imageUrl?: string;

  @Column({ default: 2000 })
  birthYear: number;

  @Column({ default: '남' })
  gender: '남' | '여';
}
