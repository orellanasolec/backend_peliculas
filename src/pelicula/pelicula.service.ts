import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { CategoriaService } from 'src/categoria/categoria.service';

@Injectable()
export class PeliculaService {


  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
   


  ) {}

  

  
  async create(createPeliculaDto: CreatePeliculaDto) {
    const pelicula = new Pelicula();
    pelicula.nombre = createPeliculaDto.nombre;
    pelicula.descripcion = createPeliculaDto.descripcion;
    pelicula.duracion = createPeliculaDto.duracion;
    pelicula.imagen = createPeliculaDto.imagen; 
    pelicula.puntuacion=0
    
    const categoria = await this.categoriaRepository.findOneBy({ id: createPeliculaDto.categoriaId });
    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }
    pelicula.categoria = categoria;
    return this.peliculaRepository.save(pelicula);

  }

  async findAll(): Promise<Pelicula[]> {
    const peliculas =await this.peliculaRepository.find({relations:['categoria']});
    return peliculas
  }




  async findOne(id: number) {
    const peliculaEncontrada = await this.peliculaRepository.findOne({
      where:{ id:id},relations:['categoria']
    })
    return peliculaEncontrada;
  }

  async update(id: number, updatePeliculaDto: UpdatePeliculaDto) {
    const peliculaModificada = await this.peliculaRepository.findOne({
      where: { id: id },
      relations: ['categoria'],
    });
  
    if (!peliculaModificada) {
      throw new NotFoundException('Película no encontrada');
    }

    if (updatePeliculaDto.nombre) {
      peliculaModificada.nombre = updatePeliculaDto.nombre;
    }
  
    if (updatePeliculaDto.descripcion) {
      peliculaModificada.descripcion = updatePeliculaDto.descripcion;
    }
  
    if (updatePeliculaDto.duracion>0) {
      peliculaModificada.duracion = updatePeliculaDto.duracion;
    }
  
    if (updatePeliculaDto.imagen) {
      peliculaModificada.imagen = updatePeliculaDto.imagen;
    }

    if (updatePeliculaDto.idCategoria>0) {
      peliculaModificada.categoria.id = updatePeliculaDto.idCategoria;
    }
  
 
    await this.peliculaRepository.save(peliculaModificada);
  
    return peliculaModificada;
  }
  

  async remove(id: number) {
    const peliculaEliminada = await this.peliculaRepository.findOne({
      where: {id:id}
    })
    if(!peliculaEliminada){
      throw new NotFoundException('Película no encontrada');
    }
    try {
      await this.peliculaRepository.delete(id); 
    } catch (error) {
      // Manejar errores (por ejemplo, si la película no existe)
      console.error('Error al eliminar la película:', error);
      throw new HttpException('Error al eliminar la película', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return peliculaEliminada
  }

  async darLike(id: number){

    const pelicula = await this.peliculaRepository.findOne({
      where: { id:id },
      relations: ['categoria'],
    });
    console.log(pelicula.nombre+" "+pelicula.puntuacion)
    pelicula.puntuacion += 10
    await this.peliculaRepository.save(pelicula);
    console.log(pelicula.nombre+" "+pelicula.puntuacion)
    return pelicula
      
  }
}
