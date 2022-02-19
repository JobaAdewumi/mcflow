import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sponsored-post')
export class SponsoredPostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    postImagePath: string;

    @Column({ default: '' })
    body: string;

    @Column()
    link: string;

    @CreateDateColumn()
    createdAt: Date;
}