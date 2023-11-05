import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { v4 } from 'uuid';
import { Response } from 'express';
import { LoginAdminDto } from './dto/login-admin.dto';
import { SmsService } from '../sms/sms.service';
import { TokenService } from '../tokens/tokens.service';
import { FindAdminDto } from './dto/find-admin.dto';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { ChangePassword } from './dto/change-password-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly  jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ){}
 
  async registration(createAdminDto: CreateAdminDto, res: Response){
    const admin = await this.adminRepo.findOne({
      where:{email: createAdminDto.email}
    })
    if (admin) throw new BadRequestException("admin already exists")
    const hashed_password = await bcrypt.hash(createAdminDto.hashed_password, 7)
    const newadmin = await this.adminRepo.create({
      ...createAdminDto,
      hashed_password: hashed_password
    });    
    const tokens = await this.tokenService.getModelToken(newadmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7)
    const  uniqueKey: string = v4();
    const updatedadmin = await this.adminRepo.update({
        hashed_refresh_token: hashed_refresh_token,
        activation_link: uniqueKey,
    },{
      where: {id: newadmin.id},returning : true
    })

    try {
      await this.mailService.sendAdminConfirmation(updatedadmin[1][0])
    } catch (error) {
      console.log(error); 
    }

  //   try {
  //     const phoneAdmin = createAdminDto.phoneNumber
  //     const url = `${process.env.API_HOST}/api/Admin/activate/${updatedadmin[1][0].activation_link}`
  //     const messages: string = `Hurmatli Admin siz mabu link orqali uzingizni activlashtirishingiz mumkin\n ${url}`
  //     const resp = await this.smsService.sendSms(phoneAdmin.slice(1),  messages)
  //     if (resp.status !== 200) throw new ServiceUnavailableException("Sms xabar jo'natilmadi");
  //     const message = 'code has been sent to *****' + phoneAdmin.slice(phoneAdmin.length - 4)
  //     return {status: "success", Detailes: message}
  // } catch (error) {
  //   console.log(error); 
  // }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 10 * 60 * 24 * 60 * 1000,
      httpOnly: true
    })
    const respons = {
      message: "admin registred",
      admin: updatedadmin[1][0],
      tokens,
    }
    return respons
  }

  async updatePass(refreshToken: string, updatePass: ChangePassword) {
    const decodedToken = this.jwtService.decode(refreshToken);
    const admin = await this.adminRepo.findOne({ where: { id: decodedToken['id'] } });
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
    const [updatedRowCount, [updatedAdmin]] = await this.adminRepo.update(
      { hashed_password: hashed_password },
      {
        where: { id: decodedToken['id'] },
        returning: true,
      });
    if (updatedRowCount === 0 || !updatedAdmin)  throw new BadRequestException('Update failed');
    return { message: 'Successfully updated' };
  }

  async activate(link:string) {
    if(!link) throw new BadRequestException('Activation link not found')
    const updatedAdmin = await this.adminRepo.update({is_active: true}, {where: {activation_link:link, is_active:false},returning:true})
    if(!updatedAdmin[1][0]) throw new BadRequestException('Admin already activate')
    const response = {
      message: "Admin activate succesfully",
      Admin: updatedAdmin
    }
    return response
  }

  findAllAdmin() {
    return this.adminRepo.findAll();;
  }

  async login (loginAdminDto: LoginAdminDto, res: Response) {
    const {email, hashed_password} = loginAdminDto
    const admin = await this.adminRepo.findOne({where: {email}});
    console.log(admin);
    if(!admin) throw new UnauthorizedException('email or password incorrect')
    if(!admin.is_active) throw new UnauthorizedException('admin not active')
    const isMatchPass = await bcrypt.compare(hashed_password,admin.hashed_password)
    if(!isMatchPass) throw new UnauthorizedException('email or password incorrect')
    const tokens = await this.tokenService.getModelToken(admin)
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,12);
    const updateadmin = await this.adminRepo.update({hashed_refresh_token}, {where: {id:admin.id},returning:true})
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15*24*60*60*1000,
      httpOnly: true,
    })
    const response = {
      message: "admin loggid in",
      admin: updateadmin[1][0],
      tokens
    }
    return response
  }

  async logout(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    })
    if(!adminData) throw new ForbiddenException("Admin not found")
    const updatedAdmin = await this.adminRepo.update({hashed_refresh_token: null}, {where: {id: adminData.id}, returning: true})
    res.clearCookie('refresh_token')
    const response = {
      message: "Admin loggged out",
      Admin: updatedAdmin[1][0]    
      }
      return response
  }

  async refreshToken (admin_id:number, refreshToken:string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);  
    if(admin_id!=decodedToken['id']) {
      throw new BadRequestException("Admin not found")
    }
    const admin = await this.adminRepo.findOne({where: {id: admin_id}})    
    if(!admin) throw new BadRequestException("Admin not found")
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );
    if(!tokenMatch) throw new ForbiddenException('forbidden')
    const tokens = await this.tokenService.getModelToken(admin)
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,12);
    const updateAdmin = await this.adminRepo.update(
      {hashed_refresh_token}, {where: {id:admin.id},returning:true}
    )

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15*24*60*60*1000,
      httpOnly: true,
    })

    const response = {
      message: "ok",
      Admin: updateAdmin[1][0],
      tokens
    }
    return response
  }


  async findAll (findAdminDto: FindAdminDto) {
    const where = {}
    if(findAdminDto.first_name) {
      where['first_name'] = {
        [Op.like]: `%${findAdminDto.first_name}%`
      }
    }
    if(findAdminDto.last_name) {
      where['last_name'] = {
        [Op.like]: `%${findAdminDto.last_name}%`
      }
    }
    if(findAdminDto.phoneNumber) {
      where['phone'] = {
        [Op.like]: `%${findAdminDto.phoneNumber}%`
      }
    }

    if(findAdminDto.email) {
      where['email'] = {
        [Op.like]: `%${findAdminDto.email}%`
      }
    }
    const Admins = await Admin.findAll({where})
    if(!Admins) {
      throw new BadRequestException("not found")
    }
    return Admins
  }

}
