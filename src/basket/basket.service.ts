// basket.service.ts
import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './models/basket.models';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket)
    private readonly basketRepo: typeof Basket
  ) {}

  async create(createBasketDto: CreateBasketDto) {
    const basket = await this.basketRepo.findOne()
    if (createBasketDto.product_id && createBasketDto.user_id !== basket.id){
      throw new BadRequestException("Invalid basket product id or user id")
    }
    return this.basketRepo.create(createBasketDto);
  }

  async findAll() {
    const result = await this.basketRepo.findAll({ include: { all: true } });
    return result;
  }

  findOne(id: number) {
    return this.basketRepo.findByPk(id, { include: { all: true } });
  }

  async remove(id: number) {
    const basket = await this.basketRepo.destroy({ where: { id } });
    if (!basket) {
      throw new HttpException("Savat topilmadi", HttpStatus.NOT_FOUND);
    }
    return { message: "Savat o'chirildi" };
  }
}
