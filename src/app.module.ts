// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Importa tu nueva configuración
import jwtConfig from './config/jwt.config';

// Tus otros módulos
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaModule } from './categoria/categoria.module';
import { PeliculaModule } from './pelicula/pelicula.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    // Carga la configuración. 'load' es la clave aquí.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig], // Carga tu configuración de JWT
    }),

    // Configuración de TypeORM (sin cambios)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: configService.get<string>('NODE_ENV') === 'production' 
             ? { rejectUnauthorized: false } 
             : false,
        autoLoadEntities: true, // Esto es más limpio que listar las entidades a mano
        synchronize: false,
        logging: true,
      }),
    }),

    // --- SECCIÓN DE JWT MUY SIMPLIFICADA ---
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Ahora usamos la configuración que cargamos antes
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
    // --- FIN DE LA SECCIÓN ---

    // Tus otros módulos
    CategoriaModule,
    PeliculaModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}