
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, Min, IsEnum, ArrayNotEmpty, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory as FrontendProductCategory, ProductOptionValue as FrontendProductOptionValue, ProductOption as FrontendProductOption } from '../../../../../frontend/src/types'; 
import { CATEGORIES as FrontendCategoriesList } from '../../../../../frontend/src/constants';


class ProductOptionValueDto implements FrontendProductOptionValue {
    @IsString()
    @IsNotEmpty()
    value: string;

    @IsBoolean()
    available: boolean;
}
class ProductOptionDto implements FrontendProductOption {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionValueDto)
    @ArrayNotEmpty()
    values: ProductOptionValueDto[];
}


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true }) 
  @ArrayNotEmpty()
  imageUrls: string[];

  @IsString()
  @IsNotEmpty()
  @IsEnum(FrontendCategoriesList, { message: 'Invalid category' })
  category: FrontendProductCategory;

  @IsNumber()
  @Min(0)
  stock: number;
  
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options?: ProductOptionDto[];

  // rating and reviews are now calculated and should not be part of create DTO
  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // rating?: number;

  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // reviews?: number;
}
