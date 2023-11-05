import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductFeaturesService } from './product_features.service';
import { CreateProductFeatureDto } from './dto/create-product_feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product_feature.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/jwt.admin.guard';

@ApiTags('product_features')
@Controller('product-features')
export class ProductFeaturesController {
  constructor(private readonly productFeaturesService: ProductFeaturesService) {}

  @ApiOperation({summary: 'Create a product feature'})
  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createProductFeatureDto: CreateProductFeatureDto) {
    return this.productFeaturesService.create(createProductFeatureDto);
  }

  @ApiOperation({summary: 'find all product feature'})
  @Get('all')
  findAll() {
    return this.productFeaturesService.findAll();
  }

  @ApiOperation({summary: 'Find One product feature'})
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.productFeaturesService.findOne(+id);
  }

  @ApiOperation({summary: 'Update a product feature'})
  @UseGuards(AdminGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProductFeatureDto: UpdateProductFeatureDto) {
    return this.productFeaturesService.update(+id, updateProductFeatureDto);
  }

  @ApiOperation({summary: 'Delete a product feature'})
  @UseGuards(AdminGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.productFeaturesService.remove(+id);
  }
}
