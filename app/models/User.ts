import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { UserInfo } from "./UserInfo.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user, { lazy: true })
  userInfo!: Promise<UserInfo>;
}
