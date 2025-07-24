import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(['sku'])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @Column()
    sku: string;
}