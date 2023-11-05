import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './Models/user.models';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from '../sms/sms.module';
import { FilesModule } from '../files/files.module';
import { Basket } from '../basket/models/basket.models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Basket]),
    JwtModule.register({}),
    SmsModule,
    FilesModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
