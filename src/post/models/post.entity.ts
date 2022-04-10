import { UserEntity } from './../../auth/models/user.entity';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

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

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sponsoredPosts)
    author: UserEntity;
}