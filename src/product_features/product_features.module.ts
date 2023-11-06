import { Module } from '@nestjs/common';
import { ProductFeaturesService } from './product_features.service';
import { ProductFeaturesController } from './product_features.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductFeature } from './models/product_feature.models';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductFeature]),
    JwtModule
  ],
  controllers: [ProductFeaturesController],
  providers: [ProductFeaturesService, ProductFeature],
})
export class ProductFeaturesModule {}
