
import { IsString, IsOptional, IsNumber, IsArray, Min, IsEnum, ArrayNotEmpty, ValidateNested, IsBoolean, IsNotEmpty } from 'class-validator';
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


export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayNotEmpty()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  @IsEnum(FrontendCategoriesList, { message: 'Invalid category' })
  category?: FrontendProductCategory;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
  
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options?: ProductOptionDto[];

  // rating and reviews are now calculated and should not be part of update DTO
  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // rating?: number;

  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // reviews?: number;
}
