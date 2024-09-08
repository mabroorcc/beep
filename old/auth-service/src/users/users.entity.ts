import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Generated("increment")
  no: number;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  userName: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  picture: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
