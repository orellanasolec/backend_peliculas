import { Module } from '@nestjs/common';
import { PeliculaService } from './pelicula.service';
import { PeliculaController } from './pelicula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { CategoriaModule } from 'src/categoria/categoria.module'; // Asegúrate de importar el módulo correctamente.
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pelicula]),
    CategoriaModule,
    JwtModule.register({
        secret: 'hola123', // Usa la misma clave secreta
        signOptions: { expiresIn: '1h' },
      }),
  ],
  controllers: [PeliculaController],
  providers: [PeliculaService],
})
export class PeliculaModule {}
