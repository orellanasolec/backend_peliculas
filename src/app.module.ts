import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Cambia según la base de datos que uses
      host: 'localhost',
      port: 3311,
      username: 'user',
      password: 'password',
      database: 'mydb',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // No uses esto en producción, solo en desarrollo
    }),
  ],
})
export class AppModule {}
