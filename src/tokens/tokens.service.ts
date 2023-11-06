import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "../admins/models/admin.model";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/Models/user.models";

@Injectable()
export class TokenService {
  constructor(
    // @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly  jwtService: JwtService,
  ){}

    async getModelToken(user: Admin | User){
    const jwtPayload = {
      sub: user.id,
      is_active: user.is_active,
      email: user.email

    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      }),
    ])
    return {
      access_token: accessToken,
      refresh_token: refreshToken
  }
  }
}