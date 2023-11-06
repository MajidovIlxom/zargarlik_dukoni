import { Controller, Get, Post, Body, Param, Headers, Res, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './Models/user.models';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieGetter } from './../decorators/cookie-getter.decorator';
import { USerGuard } from 'src/guards/user.guard';
import { FindUserDto } from './dto/find-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePassword } from './dto/change-password-admin.dto';


@ApiTags("Users")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary: "register user"})
  @ApiResponse({status: 201, type: User})
  @Post('register')
  @UseInterceptors(FileInterceptor('photo'))
  registeration(
    @Body() createUserDto: CreateUserDto, 
    @Res({passthrough: true}) res: Response,
    @UploadedFile() photo: string
    ) {      
    return this.userService.registeration(createUserDto, res, photo);
  }

  @ApiOperation({summary: "login user"})
  @ApiResponse({status: 200, type: User})
  @Post("login")
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({passthrough: true}) res: Response
    ) {
    return this.userService.login(loginUserDto, res);
  }

  @ApiOperation({summary: "activate user"})
  @ApiResponse({status: 200, type: [User]})
  @Get('activate/:link')
  activate(@Param('link') link:string) {
    return this.userService.activate(link)
  }

  @ApiOperation({summary: "logout user"})
  @UseGuards(USerGuard)
  @Post("logout")
  logout(@CookieGetter('refresh_token') refresh_token: string, 
  @Res({passthrough: true}) res: Response) {
    return this.userService.logout(refresh_token, res)
  }

  @ApiOperation({summary: "refresh user's tokens"})
  @Post(':id/refresh')
  refresh(
    @Param('id') id:string, 
    @CookieGetter('refresh_token') refreshToken:string,
    @Res({passthrough: true}) res: Response){    
    return this.userService.refreshToken(+id,refreshToken,res)
  }

  @ApiOperation({summary: "filter users"})
  @Post('find')
  findAll(@Body() findUserDto: FindUserDto) {
    return this.userService.findAll(findUserDto)
  }

  @ApiOperation({summary: "Find users"})
  @Get('all')
  findAllUser() {
    return this.userService.findAllUser();
  }

  @ApiOperation({summary: 'findById a basket'})
  @UseGuards(USerGuard)
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Post('update-pass')
  // @UseGuards(USerGuard)
  // async updatePass(
  //   @Headers('authorization') authorization: string, @Body() updatePassDto: ChangePassword) {
  //   const refreshToken = authorization.replace('Bearer ', ''); 
  //   return this.userService.updatePass(refreshToken, updatePassDto);
  // }

  @Post('update-pass')
  async changePassword(
    @CookieGetter('refresh_token') refreshToken: string,
    @Body() updatePass: ChangePassword,
  ) {
    try {
      const result = await this.userService.updatePass(refreshToken, updatePass);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
