// app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaModule } from './categoria/categoria.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { PeliculaModule } from './pelicula/pelicula.module';
import { Pelicula } from './pelicula/entities/pelicula.entity';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // --- SECCIÓN MODIFICADA ---
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // CAMBIO 1: Cambia el tipo de base de datos
        type: 'postgres',

        // CAMBIO 2: Usa la URL de conexión que configuraremos en Render
        url: configService.get<string>('DATABASE_URL'),

        // CAMBIO 3: Añade la configuración SSL requerida por Render
        // Esto se activa solo si NODE_ENV es 'production'
        ssl: configService.get<string>('NODE_ENV') === 'production' 
             ? { rejectUnauthorized: false } 
             : false,

        // No es necesario listar las entidades aquí si ya tienes autoLoadEntities
        // pero si no, mantenlas.
        entities: [Categoria, Pelicula], 
        
        // ¡Perfecto! Esto es lo más importante.
        synchronize: false, 
      }),
    }),
    // --- FIN DE LA SECCIÓN MODIFICADA ---

    // El resto de tus módulos no cambian
    CategoriaModule,
    PeliculaModule,
    LoginModule,
    // La siguiente línea probablemente no sea necesaria, ya que Categoria y Pelicula
    // se importan en sus propios módulos (CategoriaModule, PeliculaModule).
    // Puedes considerar eliminarla si ya usas TypeOrmModule.forFeature en esos módulos.
    // TypeOrmModule.forFeature([Pelicula, Categoria]), 
    JwtModule.registerAsync({
      // ... tu configuración de JWT no necesita cambios ...
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}