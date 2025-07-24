import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  private firstMissingLetter(name: string): string {
    const letters = name.toLowerCase().replace(/[^a-z]/g, '');
    const set = new Set(letters);
    for (let i = 97; i <= 122; i++) {
      const char = String.fromCharCode(i);
      if (!set.has(char)) return char;
    }
    return '_';
  }

  private handleUniqueConstraintError(error: any) {
    const driverError = error.driverError || error;
    const code = driverError.code;
    const message = driverError.message || '';

    if (
      code === 'SQLITE_CONSTRAINT' &&
      message.includes('UNIQUE constraint failed: product.sku')
    ) {
      throw new BadRequestException('Já existe um produto com esse SKU.');
    }
  }

  async create(dto: CreateProductDto) {
    try {
      const product = this.repo.create(dto);
      return await this.repo.save(product);
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async findAll() {
    const products = await this.repo.find({ order: { name: 'ASC' } });
    return products.map(p => ({
      ...p,
      missingLetter: this.firstMissingLetter(p.name),
    }));
  }

  async findOne(id: number) {
    const p = await this.repo.findOneBy({ id });
    if (!p) throw new NotFoundException('Produto não encontrado');
    return { ...p, missingLetter: this.firstMissingLetter(p.name) };
  }

  async update(id: number, dto: UpdateProductDto) {
    try {
      await this.repo.update(id, dto);
      return this.findOne(id);
    } catch (error) {
      this.handleUniqueConstraintError(error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { success: true };
  }
}
