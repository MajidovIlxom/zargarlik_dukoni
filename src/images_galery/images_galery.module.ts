import { Module } from '@nestjs/common';
import { ImagesGaleryService } from './images_galery.service';
import { ImagesGaleryController } from './images_galery.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImagesGalery } from './models/images_galery.models';
import { FilesModule } from '../files/files.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([ImagesGalery]),
  FilesModule,
  JwtModule
],
  controllers: [ImagesGaleryController],
  providers: [ImagesGaleryService],
})
export class ImagesGaleryModule {}
