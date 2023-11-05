import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "../admins/models/admin.model";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly  jwtService: JwtService,
  ){}

    async getModelToken(user: Admin){
    const jwtPayload = {
      id: user.id,
      is_active: user.is_active,
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