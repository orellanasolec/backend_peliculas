import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pelicula } from 'src/pelicula/entities/pelicula.entity';

@Entity({ name: 'categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  nombre: string;

  @OneToMany(() => Pelicula, (pelicula) => pelicula.categoria)
  peliculas: Pelicula[];
}
