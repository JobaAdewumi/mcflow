import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('couponcode')
export class CouponCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponCode: string;
}
