import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    // --- LÍNEAS DE DEBUG ADICIONALES ---
    // Loguea el token completo para verificar si hay espacios extra o errores
    console.log('Bearer Token recibido:', bearerToken);

    if (!bearerToken) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [type, token] = bearerToken.split(' ');

    // Loguea el tipo de token y el token extraído para su inspección
    console.log('Tipo de token:', type);
    console.log('Token extraído:', token);

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido. Se espera "Bearer <token>"');
    }
    
    const jwtSecret = this.configService.get('jwt.secret');
    console.log('Secreto JWT obtenido del ConfigService:', jwtSecret);
    
    try {
      // Verificamos el token con el secreto obtenido del servicio de configuración.
      const valor = this.jwtService.verify(token, { secret: jwtSecret });
      request.datosUsuarios = valor;
      console.log('Token verificado con éxito:', valor);
    } catch (error) {
      // --- LÍNEAS DE DEBUG CRÍTICAS ---
      // Imprime el objeto de error completo para saber la causa exacta.
      console.error('Error de verificación de token:', error);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado. Por favor, inicia sesión de nuevo.');
      }
      throw new UnauthorizedException('Token inválido.');
    }

    return true;
  }
}