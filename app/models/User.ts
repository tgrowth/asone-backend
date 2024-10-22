import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { UserInfo } from "./UserInfo.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  uid!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, { lazy: true })
  userInfo!: Promise<UserInfo>;
}
