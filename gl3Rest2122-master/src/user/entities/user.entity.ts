import { Cv } from "src/cv/Entities/cv.entity";
import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
export class User extends TiemstampEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({})
    Designation: string;
    
    @OneToMany(
        ()=>Cv,(cv:Cv)=>cv.id,{eager:false}
    )
    cv:Cv;

    
}
