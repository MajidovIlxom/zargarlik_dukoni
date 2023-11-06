import { Injectable, HttpException, HttpStatus, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './models/basket.models';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket)
    private readonly basketRepo: typeof Basket,
    private readonly jwtService: JwtService
  ) {}

  async create(createBasketDto: CreateBasketDto) {
    try {
      const basket = await this.basketRepo.create(createBasketDto);
      return basket;
    } catch (error) {
      console.error("Xatolik yuz berdi: ", error);
      throw error; // xatolikni qaytarish
    }
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
