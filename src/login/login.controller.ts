  import { Controller, Post, Body, Res, Req } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { LoginService } from './login.service';
  import { JwtService } from '@nestjs/jwt';
  
  @Controller('login')
  export class LoginController {
    constructor(
      private readonly loginService: LoginService,
      private readonly jwtService: JwtService, // Inyectamos JwtService
    ) {}
  
    @Post()
    async login(
      @Req() req: Request,
      @Body('usuario') usuario: string,
      @Body('password') password: string,
      @Res() res: Response,
    ) {
      console.log('Datos recibidos:', { usuario, password });
      console.log(req.body);
  
      const result = await this.loginService.login(usuario, password);
  
      // Verificamos si el login fue exitoso
      if (result) {
        // Generar el token JWT
        const payload = { username: usuario}; // Agrega más información si es necesario
        const token = this.jwtService.sign(payload,{
            secret:"hola123",
            expiresIn: '5m',  
        });
  
        // Enviar el token como respuesta
        return res.status(200).json({
          message: `Bienvenido, ${usuario}`,
          token,
        });
      } else {
        // Respuesta de error en caso de fallo de login
        return res.status(400).json({ message: 'Credenciales incorrectas' });
      }
    }
  }
  



