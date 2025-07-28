import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService:JwtService){

  }

  
  canActivate(context: ExecutionContext,): boolean | Promise<boolean>{
   
    const request = context.switchToHttp().getRequest();

   const bearerToken= request.headers.authorization;
   
   if (!bearerToken){
    return false
   }
   if (bearerToken.split(' ')[0] !=='Bearer'){
    return false
   }
   const token =bearerToken.split(' ')[1];
   try{
    const valor=this.jwtService.verify(token,{ secret: process.env.JWT_SECRET })
    request.datosUsuarios=valor
  
   } catch (error) {
    if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
    }
    throw new UnauthorizedException('Token inválido');
}


    return true;
  }
}
