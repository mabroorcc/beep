import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("members")
export class Members extends BaseEntity {
  @PrimaryColumn()
  memberId: string;

  @Index()
  @Column()
  chatId: string;
}
