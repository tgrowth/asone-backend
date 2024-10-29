import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Symptom {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: string;

    @Column()
    name!: string;
}
