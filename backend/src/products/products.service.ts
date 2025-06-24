import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, Prisma } from '@prisma/client'; // Import Prisma

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(category?: string, search?: string): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map(c => c.category);
  }

  async updateStock(id: string, quantityToDecrement: number): Promise<Product> {
    // Ensure quantityToDecrement is positive
    if (quantityToDecrement <= 0) {
      throw new Error('Quantity to decrement must be positive.');
    }

    const updatedProductRecord = await this.prisma.product.updateMany({
      where: {
        id: id,
        stock: {
          gte: quantityToDecrement, // Only update if stock is sufficient
        },
      },
      data: {
        stock: {
          decrement: quantityToDecrement,
        },
      },
    });

    if (updatedProductRecord.count === 0) {
      // Check if the product exists to give a more specific error
      const productExists = await this.prisma.product.findUnique({ where: { id } });
      if (!productExists) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }
      // If product exists but count is 0, it means stock was insufficient
      throw new Error( // Consider a custom exception class e.g., InsufficientStockException
        `Insufficient stock for product ID ${id} to decrement by ${quantityToDecrement}.`,
      );
    }

    // Fetch and return the updated product
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
        // This case should ideally not be reached if updateMany was successful
        // and product wasn't deleted concurrently.
        throw new NotFoundException(`Product with ID ${id} not found after stock update.`);
    }
    return product;
  }
}