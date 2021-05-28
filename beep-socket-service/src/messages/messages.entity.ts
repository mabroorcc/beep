import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("messages")
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn("rowid")
  id: number;

  @Column("text")
  message: string;

  @Index()
  @Column()
  chatId: string;

  @Column("text")
  seenBy: string;

  @Column()
  attachment: string;

  @Column()
  attType: string;

  @Index()
  @Column()
  senderId: string;

  @CreateDateColumn()
  date: Date;
}
