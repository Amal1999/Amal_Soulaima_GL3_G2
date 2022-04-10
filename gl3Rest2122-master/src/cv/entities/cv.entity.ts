import { TiemstampEntity } from "src/generics/tiemstamp.entity";
import { Skill } from "src/skills/Entities/skill.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('CV')
export class Cv extends TiemstampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({})
  name: string;
  @Column({})
  Firstname: string;
  @Column({})
  Age: number;
  @Column({})
  Cin: string;
  @Column({})
  Job: string;
  @Column({})
  Path: string;
  @ManyToMany(
    ()=>Skill,(Skill:Skill)=>Skill.id,{eager:false}
)

Skill:Skill[];
@ManyToOne(
  ()=>User,(User:User)=>User.id,{eager:false}
)
User:User;

}