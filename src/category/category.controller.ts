import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/jwt.admin.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({summary: 'Create category'})
  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({summary: 'All category'})
  @Get('all')
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({summary: "findOne Category"})
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOperation({summary: "Update  category"})
  @UseGuards(AdminGuard)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {   
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @ApiOperation({summary:"Delete category"})
  @UseGuards(AdminGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
