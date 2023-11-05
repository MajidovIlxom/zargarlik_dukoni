import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/jwt.admin.guard';


@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({summary: "Create a new product"})
  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({summary: "find all product"})
  @Get("all")
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({summary: "find one product"})
  @Get('findOne/:id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOperation({summary: "update product"})
  @UseGuards(AdminGuard)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({summary: "Delete product"})
  @UseGuards(AdminGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
