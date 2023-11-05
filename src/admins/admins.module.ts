import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminController } from './admins.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { SmsModule } from '../sms/sms.module';
import { TokenService } from '../tokens/tokens.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin, ]),
    JwtModule.register({}),
    SmsModule,
    MailModule
  ],
    controllers: [AdminController], 
    providers: [AdminsService,TokenService ],
})
export class AdminsModule {}
