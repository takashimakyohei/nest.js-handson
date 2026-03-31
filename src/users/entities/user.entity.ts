import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // DB側は 'created_at' に、TS側は 'createdAt' になる
  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  // DB側は 'updated_at' に、TS側は 'updatedAt' になる
  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt: Date;

}