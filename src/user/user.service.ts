import { FilesService } from './../files/files.service';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException, ServiceUnavailableException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './Models/user.models';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import *as bcrypt from 'bcrypt';
import {v4} from 'uuid'
import { LoginUserDto } from './dto/login-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { Op } from 'sequelize';
import { SmsService } from '../sms/sms.service';
import { MailService } from '../mail/mail.service';
import { ChangePassword } from './dto/change-password-admin.dto';
import { TokenService } from '../tokens/tokens.service';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepo: typeof User,
    private readonly  jwtService: JwtService,
    private readonly fileService: FilesService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ){}



  findAllUser() {
    return  this.userRepo.findAll()
  }


  async registeration(createUserDto: CreateUserDto, res: Response, user_photo: string ){
    try {
      const fileName = await this.fileService.createFile(user_photo)
      const user = await this.userRepo.findOne({
        where:{email: createUserDto.email}
      })
      if (user) {
        throw new BadRequestException("User already exists")
      }
      if (createUserDto.password !== createUserDto.confirm_password){
        throw new BadRequestException("Passwor is not match")
      }
      const hashed_password = await bcrypt.hash(createUserDto.password, 7)
      const newUser = await this.userRepo.create({
        ...createUserDto,
        hashed_password: hashed_password,
        user_photo: fileName
      });
      
      const tokens = await this.tokenService.getModelToken(newUser);
      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7)
      const  uniqueKey: string = v4();
      const updatedUser = await this.userRepo.update(
        {
          hashed_refresh_token: hashed_refresh_token,
          activation_link: uniqueKey
      },
      {
        where: {id: newUser.id},returning : true
      })

      
      try {
        await this.mailService.sendUserConfirmation(updatedUser[1][0])
      } catch (error) {
        console.log(error); 
      }

      // try {
      //     const phoneUser = createUserDto.phone
      //     const url = `${process.env.API_HOST}/api/user/activate/${updatedUser[1][0].activation_link}`
      //     const messages: string = `Hurmatli mijos siz mabu link orqali uzingizni activlashtirishingiz mumkin ${url}`
      //     const resp = await this.smsService.sendSms(phoneUser.slice(1),  messages)
      //     if (resp.status !== 200) {
      //       throw new ServiceUnavailableException("Otp jo'natilmadi");
      //     }
      //     const message = 'code has been sent to *****' + phoneUser.slice(phoneUser.length - 4)
      //     return {status: "success", Detailes: message}
      // } catch (error) {
      //   console.log(error); 
      // }
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 10 * 60 * 24 * 60 * 1000,
        httpOnly: true
      })
      
      const respons = {
        message: "User registred",
        user: updatedUser[1][0],
        tokens,
      }
      return respons

    } catch (error) {
    console.log(error);
    if (error) throw new BadGatewayException("Fileni yozishda xatolik")
      
  }

  }


  async activate(link:string) {
    if(!link){
      throw new BadRequestException('Activation link not found')
    }
    const updatedUser = await this.userRepo.update({is_active: true}, {where: {activation_link:link, is_active:false},returning:true})
    if(!updatedUser[1][0]){
      throw new BadRequestException('User already activate')
    }
    const response = {
      message: "User activate succesfully",
      user: updatedUser
    }
    return response
  }

  async login (loginUserDto: LoginUserDto, res: Response) {
    const {email, password} = loginUserDto
    const user = await this.userRepo.findOne({where: {email}});
    if(!user) {
      throw new UnauthorizedException('email or password incorrect')
    }
    if(!user.is_active) {
      throw new UnauthorizedException('User not active')
    }
    const isMatchPass = await bcrypt.compare(password,user.hashed_password)
    if(!isMatchPass) {
      throw new UnauthorizedException('email or password incorrect')
    }

    const tokens = await this.tokenService.getModelToken(user)
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,12);
    const updateUser = await this.userRepo.update(
      {hashed_refresh_token}, {where: {id:user.id},returning:true}
    )

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15*24*60*60*1000,
      httpOnly: true,
    })

    const response = {
      message: "User loggid in",
      user: updateUser[1][0],
      tokens
    }
    return response
  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    })
    if(!userData) {
      throw new ForbiddenException("User not found")
    }
    const updatedUser = await this.userRepo.update({hashed_refresh_token: null}, {where: {id: userData.sub}, returning: true})
    res.clearCookie('refresh_token')
    const response = {
      message: "User loggged out",
      user: updatedUser[1][0]    
      }
      return response
  }

  async refreshToken (user_id:number, refreshToken:string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);    
    if(user_id!=decodedToken['id']) {
      throw new BadRequestException("user not found")
    }
    const user = await this.userRepo.findOne({where: {id: user_id}})    
    if(!user) {
      throw new BadRequestException("User not found")
    }
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if(!tokenMatch) {
      throw new ForbiddenException('forbidden')
    }
    const tokens = await this.tokenService.getModelToken(user)
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,12);
    const updateUser = await this.userRepo.update(
      {hashed_refresh_token}, {where: {id:user.id},returning:true}
    )

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15*24*60*60*1000,
      httpOnly: true,
    })

    const response = {
      message: "ok",
      user: updateUser[1][0],
      tokens
    }
    return response
  }

  async findAll (findUserDto: FindUserDto) {
    const where = {}

    if(findUserDto.first_name) {
      where['first_name'] = {
        [Op.like]: `%${findUserDto.first_name}%`
      }
    }
    if(findUserDto.last_name) {
      where['last_name'] = {
        [Op.like]: `%${findUserDto.last_name}%`
      }
    }
    if(findUserDto.phone) {
      where['phone'] = {
        [Op.like]: `%${findUserDto.phone}%`
      }
    }

    if(findUserDto.email) {
      where['email'] = {
        [Op.like]: `%${findUserDto.email}%`
      }
    }
    const users = await User.findAll({where})
    if(!users) {
      throw new BadRequestException("not found")
    }
    return users
  }

  async findOne(id: number){
    return this.userRepo.findByPk(id, {include: {all: true}})
  }


  async updatePass(refreshToken: string, updatePass: ChangePassword) {
    const decodedToken = this.jwtService.decode(refreshToken);
    const admin = await this.userRepo.findOne({ where: { id: decodedToken['id'] } });
    if (!admin) throw new BadRequestException('Admin not found');
    if (updatePass.old_password && updatePass.new_password) {
      const oldPassMatch = await bcrypt.compare(
        updatePass.old_password,
        admin.hashed_password,
        );
      if (!oldPassMatch) throw new BadRequestException('Incorrect password');
    }
    const hashed_password = await bcrypt.hash(
      updatePass.new_password,
      12,
    );
    const [updatedRowCount, [updatedAdmin]] = await this.userRepo.update(
      { hashed_password: hashed_password },
      {
        where: { id: decodedToken['id'] },
        returning: true,
      });
    if (updatedRowCount === 0 || !updatedAdmin)  throw new BadRequestException('Update failed');
    return { message: 'Successfully updated' };
  }

  // const decodedToken = this.jwtService.decode(refreshToken);
  //   if (!decodedToken || !decodedToken['id']) {
  //     throw new BadRequestException('Invalid token');
  //   }
  //   const admin = await this.userRepo.findOne({ where: { id: decodedToken['id'] } });
  //   if (!admin) throw new BadRequestException('Admin not found');
  
  //   if (!updatePass.old_password || !updatePass.new_password) {
  //     throw new BadRequestException('Both old and new passwords are required');
  //   }
  //   try {
  //     const hashed_password = await bcrypt.hash(updatePass.new_password, 12);
  //     // ...
  //   // } catch (error) {
  //   //   throw new BadRequestException('Failed to hash the new password');
  //   // }
  //   // try {
  //     const [updatedRowCount, [updatedAdmin]] = await this.userRepo.update(
  //       { hashed_password: hashed_password },
  //       {
  //         where: { id: decodedToken['id'] },
  //         returning: true,
  //       }
  //     );
  //     if (updatedRowCount === 0 || !updatedAdmin) {
  //       throw new BadRequestException('Update failed');
  //     }
  //     return { message: 'Successfully updated' };
  //   } catch (error) {
  //     throw new BadRequestException('Update operation failed');
  //   }
            

  
  // }
}

