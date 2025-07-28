
 // data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
       ? { rejectUnauthorized: false } 
       : false,
  
  // --- CAMBIA ESTAS LÍNEAS ---
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"], 
  // --------------------------
});