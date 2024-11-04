import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  mimetype: string;

  @Column({ type: "blob" })
  data: string;

  @Column({ length: 100, nullable: true })
  original_name: string;

  @CreateDateColumn()
  created: Date;
}
