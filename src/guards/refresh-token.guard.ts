import { Injectable,CanActivate,ExecutionContext,UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { User } from 'src/user/Models/user.models';

@Injectable()
export class RefreshTokenGuard  implements CanActivate {
    constructor(private readonly jwtSevice: JwtService) {}
    canActivate (context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        const refreshToken = req.cookies["refresh_token"];
            
        if(!refreshToken) {
            throw new UnauthorizedException("User unauthorization1")
        }
        async function verify(token:string, jwtservice: JwtService) {
            const user: Partial<User> = await jwtservice.verify(token, {
                secret: process.env.REFRESH_TOKEN_KEY,
            });
            if(!user) {
                throw new UnauthorizedException("User not found1")
            }
            
            if(!user.is_active) {
                throw new UnauthorizedException("User not found")
            }
            req.user = user
            return true
        }
        return verify(refreshToken,this.jwtSevice)
  
    }
}