import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService // <--- ¡Importante! Inyectamos ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      // Usamos una excepción estándar de NestJS en lugar de devolver 'false'
      // Esto proporciona un mensaje de error más claro al cliente.
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Dividimos el token en "Bearer" y el token real
    const [type, token] = bearerToken.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido. Se espera "Bearer <token>"');
    }
    
    // Obtenemos el secreto usando el ConfigService, asegurándonos de que es el valor correcto.
    const jwtSecret = this.configService.get('jwt.secret');

    try {
      // Verificamos el token con el secreto obtenido del servicio de configuración.
      const valor = this.jwtService.verify(token, { secret: jwtSecret });
      request.datosUsuarios = valor;
      console.log('Token verificado con éxito:', valor);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado. Por favor, inicia sesión de nuevo.');
      }
      // Para cualquier otro error de verificación del token
      throw new UnauthorizedException('Token inválido.');
    }

    return true;
  }
}
