import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './Models/user.models';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from '../sms/sms.module';
import { FilesModule } from '../files/files.module';
import { Basket } from '../basket/models/basket.models';
import { MailModule } from '../mail/mail.module';
import { TokenService } from '../tokens/tokens.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    SmsModule,
    FilesModule,
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService]
})
export class UserModule {}
