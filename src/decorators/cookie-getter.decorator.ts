import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";

export const CookieGetter =  createParamDecorator(
    async (data:string, context: ExecutionContext): Promise<string>=> {
        console.log(data)
        const request = context.switchToHttp().getRequest();
        const refreshToken = request.cookies[data];
        // console.log(request);
        
        if(!refreshToken) {
            throw new UnauthorizedException('Token topilmadi');
        }
        return refreshToken;
    }
)