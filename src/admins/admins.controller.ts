import { Controller, Get, Post, Body, Param, Headers, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminsService } from './admins.service';
import { Admin } from './models/admin.model';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminGuard } from '../guards/jwt.admin.guard';
import { CookieGetter } from '../decorators/cookie-getter.decorator';
import { FindAdminDto } from './dto/find-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChangePassword } from './dto/change-password-admin.dto';


@ApiTags("Admins")
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminsService) {}

  @ApiOperation({summary: "register admin"})
  @ApiResponse({status: 201, type: Admin})
  @Post("signup")
  registeration(
    @Body() createAdminDto: CreateAdminDto,
    @Res({passthrough: true}) res: Response
    ) {
    return this.adminService.registration(createAdminDto, res);
  }

  @Post('update-pass')
  @UseGuards(AdminGuard)
  async updatePass(
    @Headers('authorization') authorization: string, @Body() updatePassDto: ChangePassword) {
    const refreshToken = authorization.replace('Bearer ', ''); 
    return this.adminService.updatePass(refreshToken, updatePassDto);
  }
  
  @ApiOperation({summary: "activate user"})
  @ApiResponse({status: 200, type: [Admin]})
  @Get('activate/:link')
  activate(@Param('link') link:string) {
    return this.adminService.activate(link)
  }

  @Get('all')
  findAllAdmin() {
    return this.adminService.findAllAdmin();
  }

  @ApiOperation({summary: "login admin"})
  @ApiResponse({status: 200, type: Admin})
  @Post("signin")
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({passthrough: true}) res: Response
    ) {
      return this.adminService.login(loginAdminDto, res);
  }
  
  @ApiOperation({summary: "logout Admin"})
  @UseGuards(AdminGuard)
  @Post("signout")
  logout(
    @CookieGetter('refresh_token') refresh_token: string, 
    @Res({passthrough: true}) res: Response) {
      return this.adminService.logout(refresh_token, res)
    }
    
    @ApiOperation({summary: "refresh Admin's tokens"})
    @Post(':id/refresh')
    refresh(
      @Param('id') id:string, 
      @CookieGetter('refresh_token') refreshToken:string,
      @Res({passthrough: true}) res: Response){
      return this.adminService.refreshToken(+id,refreshToken,res)
    }
    
    @ApiOperation({summary: "filter Admins"})
    @Post('find')
    findAll(@Body() findAdminDto: FindAdminDto) {
        return this.adminService.findAll(findAdminDto)
      }
  }
  