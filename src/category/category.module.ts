import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.models';
import { AdminGuard } from '../guards/jwt.admin.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Category]),
    JwtModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
