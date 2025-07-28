import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
@Entity({ name: 'pelicula' })
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  nombre: string;

  @Column({ type: 'text'})
  descripcion: string;

  @Column({ type: 'int'})
  duracion: number;

  @Column({ type: 'int'} )
  puntuacion: number;

  @Column({ type: 'varchar', length: 255})
  imagen: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.peliculas)
  @JoinColumn({ name: 'idcategoria' })
  categoria: Categoria;
}
