// data-source.ts
 import { DataSource } from 'typeorm';
 import { config } from 'dotenv';
 
 config(); 
 
 export default new DataSource({
   type: 'postgres',
   url: process.env.DATABASE_URL,
   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
   entities: [__dirname + '/**/*.entity{.ts,.js}'],
   migrations: [__dirname + '/migrations/*{.ts,.js}'],
 });
 