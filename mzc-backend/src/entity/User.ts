import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn, Unique,
  UpdateDateColumn
} from "typeorm";
import { Comment } from './Comment';
import { Role } from "./Role";
import { Board } from "./Board";

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn({ type: "number" })
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  username: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
  })
  roles: Role[];

  @OneToMany(type => Board, board => board.user)
  boards: Board[];

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];
}
