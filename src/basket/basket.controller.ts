import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { USerGuard } from '../guards/user.guard';

@ApiTags("basket")
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({summary: 'Create a new basket'})
  @UseGuards(USerGuard)
  @Post('create')
  create(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.create(createBasketDto);
  }

  @ApiOperation({summary: 'All a basket'})
  @UseGuards(USerGuard)
  @Get('all')
  findAll() {
    return this.basketService.findAll();
  }

  @ApiOperation({summary: 'findById a basket'})
  @UseGuards(USerGuard)
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(+id);
  }
    
  @ApiOperation({summary: 'Delete a basket'})
  @UseGuards(USerGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(+id);
  }
}
