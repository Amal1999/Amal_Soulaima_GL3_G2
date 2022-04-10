import { Cv } from "src/cv/Entities/cv.entity";
import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity('Skill')
export class Skill extends TiemstampEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({})
    Designation: string;

    @ManyToMany(
        ()=>Cv,(cv:Cv)=>cv.id,{eager:false}
    )
    @JoinTable()
    cv:Cv[];
}
