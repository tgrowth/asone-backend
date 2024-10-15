import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

@Entity("love_languages_results")
export class LoveLanguagesResult {
  @PrimaryColumn()
  user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
  test_date!: Date;

  @Column("smallint", { array: true })
  language_ids!: number[];

  @Column("integer", { array: true })
  percentages!: number[];
}
