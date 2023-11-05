import { Injectable,CanActivate,ExecutionContext,UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { User } from 'src/user/Models/user.models';

@Injectable()
export class USerGuard  implements CanActivate {
    constructor(private readonly jwtSevice: JwtService) {}
    canActivate (context: ExecutionContext) {
        const req = context.switchToHttp().getRequest()
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            throw new UnauthorizedException("User unauthorization1")
        }
        const bearer = authHeader.split(" ")[0]
        const token = authHeader.split(" ")[1]
        if(bearer!= "Bearer" || !token){
            throw new UnauthorizedException("User unauthorization2")
        }
        async function verify(token:string, jwtservice: JwtService) {
            const user: Partial<User> = await jwtservice.verify(token, {
                secret: process.env.ACCESS_TOKEN_KEY,
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
        return verify(token,this.jwtSevice)
  
    }
}