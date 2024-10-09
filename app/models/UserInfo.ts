import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne("User", "userInfo", { lazy: true })
  @JoinColumn()
  user!: Promise<any>;

  @Column({ default: false })
  isUsingForSelf!: boolean;

  @Column({ nullable: true })
  code!: string;

  @Column({ nullable: true })
  birthday!: Date;

  @Column({ nullable: true })
  periodLength!: number;

  @Column({ nullable: true })
  cycleLength!: number;

  @Column({ nullable: true })
  lastPeriodDate!: Date;

  @Column({ default: false })
  isTryingToConceive!: boolean;

  @Column({ default: false })
  isPartnerMode!: boolean;

  @Column({ nullable: true })
  partnerEmail!: string;

  @Column({ nullable: true })
  inviteCode!: string;

  @Column({ default: false })
  isComplete!: boolean;
}
