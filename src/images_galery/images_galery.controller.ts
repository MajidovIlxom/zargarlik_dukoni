import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ImagesGaleryService } from './images_galery.service';
import { CreateImagesGaleryDto } from './dto/create-images_galery.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/jwt.admin.guard';

@ApiTags('images-galery')
@Controller('images-galery')
export class ImagesGaleryController {
  constructor(private readonly imagesGaleryService: ImagesGaleryService) {}

  @ApiOperation({summary: "Create Images"})
  @UseGuards(AdminGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() createImagesGaleryDto: CreateImagesGaleryDto,
    @UploadedFile() photo: any
  ) {
    return this.imagesGaleryService.create(createImagesGaleryDto, photo);
  }

  @ApiOperation({summary: "find all"})
  @Get('all')
  findAll() {
    return this.imagesGaleryService.findAll();
  }

  @ApiOperation({summary: "find One"})
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.imagesGaleryService.findOne(+id);
  }

  @ApiOperation({summary: "Images removed"})
  @UseGuards(AdminGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.imagesGaleryService.remove(+id);
  }
}
