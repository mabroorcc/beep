import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("members")
export class Members extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  memberId: string;

  @Index()
  @Column()
  chatId: string;
}
