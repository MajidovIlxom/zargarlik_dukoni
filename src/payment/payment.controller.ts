import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { USerGuard } from '../guards/user.guard';
import { AdminGuard } from '../guards/jwt.admin.guard';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({summary: 'Create payment'})
  @UseGuards(USerGuard)
  @Post('create')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({summary: 'find all payment'})
  @UseGuards(USerGuard)
  @Get('all')
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiOperation({summary: 'find One  payment'})
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @ApiOperation({summary: 'Update payment'})
  @UseGuards(AdminGuard)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @ApiOperation({summary: 'Delete payment'})
  @UseGuards(AdminGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
