import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/models/admin.model';
import { User } from './user/Models/user.models';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductFeaturesModule } from './product_features/product_features.module';
import { BasketModule } from './basket/basket.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ImagesGaleryModule } from './images_galery/images_galery.module';
import { Basket } from './basket/models/basket.models';
import { Product } from './product/models/product.models';
import { ImagesGalery } from './images_galery/models/images_galery.models';
import { Category } from './category/models/category.models';
import { Order } from './order/models/order.models';
import { Payment } from './payment/models/payment.model';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}),
    ServeStaticModule.forRoot({rootPath: resolve(__dirname, 'static')}),
    SequelizeModule.forRoot({
      dialect:"postgres",
      host: process.env.POSTGREST_HOST,
      port:Number(process.env.POSTGREST_PORT),
      username: process.env.POSTGREST_USER,
      password: String(process.env.POSTGREST_PASSWORD),
      database: process.env.POSTGREST_DB,
      models:[
        Admin,
        User,
        Basket,
        Product,
        ImagesGalery,
        Category,
        Order,
        Payment
      ],
      autoLoadModels: true,
      logging: false,
    }),
    AdminsModule,
    UserModule,
    CategoryModule,
    ProductModule,
    ProductFeaturesModule,
    BasketModule,
    OrderModule,
    PaymentModule,
    ImagesGaleryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
