import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment) 
  private readonly paymentRepo: typeof Payment
  ){}

  create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(createPaymentDto)
    return payment
  }

  findAll() {
    return this.paymentRepo.findAll({include: {all: true}})
  }

  findOne(id: number) {
    return this.paymentRepo.findByPk(id,{include: {all: true}})
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepo.update(updatePaymentDto, {where: {id: id},returning: true })
    return payment[1][0]
  }

  remove(id: number) {
    const payment = this.paymentRepo.destroy({where: {id: id}})
    if (!payment) throw new BadRequestException("payment not found")
    return {Detalis: "payment removed successfully"}
  }
}
