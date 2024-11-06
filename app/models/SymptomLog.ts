import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SymptomLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    uid!: string;

    @Column()
    date!: string;

    @Column("int", { array: true })
    symptoms!: number[];
}

