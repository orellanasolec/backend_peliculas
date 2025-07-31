// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  // Comprobamos que la variable exista, si no, lanzamos un error claro.
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }

  return {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '5m', // Puedes ajustar el tiempo de expiración
    },
  };
});

