import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.models';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order)
  private readonly orderRepo: typeof Order
  ){}
  
  async create(createOrderDto: CreateOrderDto) {
    return this.orderRepo.create(createOrderDto)
  }

  findAll() {
    return this.orderRepo.findAll({include: {all: true}});
  }

  findOne(id: number) {
    return this.orderRepo.findByPk(id,{include: {all: true}})
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    const updateOrder = this.orderRepo.update(updateOrderDto,{
      where: {id: id},returning: true
    })
    return updateOrder[1][0]
  }

  remove(id: number) {
    const removeOrder = this.orderRepo.destroy({
      where: {id: id}
    })
    if (!removeOrder) throw new BadRequestException("Order not found")

    return {Detalis: "deleted successfully"}
  }
}
