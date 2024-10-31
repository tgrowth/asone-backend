import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PeriodLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    uid!: string;
    
    @Column("simple-array")
    periodLogs!: string[];
}

