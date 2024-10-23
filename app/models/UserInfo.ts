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

  @Column()
  uid!: string;

  @Column()
  username!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column()
  isUsingForSelf!: boolean;

  @Column()
  birthday!: string;

  @Column()
  state!: string;

  @Column()
  periodLength!: number;

  @Column()
  cycleLength!: number;

  @Column()
  lastPeriodStartDate!: string;

  @Column()
  lastPeriodEndDate!: string;

  @Column()
  isTryingToConceive!: boolean;

  @Column()
  mood!: string;

  @Column()
  symptoms!: string;

  @Column()
  partnerMode!: boolean;

  @Column({ nullable: true })
  partnerUid!: string;

  @Column()
  code!: string;

  @Column()
  isComplete!: boolean;
}
