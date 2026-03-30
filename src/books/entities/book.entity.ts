import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: false })
  isPublished: boolean;

  // DB側は 'created_at' に、TS側は 'createdAt' になる
  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  // DB側は 'updated_at' に、TS側は 'updatedAt' になる
  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

}