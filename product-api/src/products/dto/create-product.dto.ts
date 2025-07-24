import { IsNotEmpty, IsNumber, Min } from "class-validator";


export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0.01)
    price: number;

    @IsNotEmpty()
    sku: string;
}