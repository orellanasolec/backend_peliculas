import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { PeliculaService } from './pelicula.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { Response } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';

@Controller('pelicula')
export class PeliculaController {
  constructor(private readonly peliculaService: PeliculaService) {}

  @Post()
  async create(@Body() createPeliculaDto: CreatePeliculaDto,@Res() res: Response) {
    console.log("llego un dto")
    console.log(createPeliculaDto)
    const peliculaCreada= await this.peliculaService.create(createPeliculaDto);

    if (peliculaCreada) {
      res.status(200).send(peliculaCreada);
      return
    }
    res.status(404).send({ message: 'No se pudo crear la película' }); 
   }
  
  @Get()
  async findAll(): Promise<Pelicula[]> {
    return await this.peliculaService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    console.log("alguien busco aca")
    const peliculaEncontrada= await this.peliculaService.findOne(+id);
    if (peliculaEncontrada) {
      res.status(200).send(peliculaEncontrada);
      return
    }
    res.status(404).send({ message: 'Película no encontrada' }); 
   }
    
     

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePeliculaDto: UpdatePeliculaDto,@Res() res: Response) {
    const peliculaModificada=await this.peliculaService.update(+id, updatePeliculaDto);
    if (peliculaModificada) {
      res.status(200).send(peliculaModificada); 
      return
    }
    res.status(404).send({ message: 'Película no encontrada' }); 
   }
  

  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res:Response) {
    const peliculaEliminada=await this.peliculaService.remove(+id);
    if (peliculaEliminada) {
      res.status(200).send(peliculaEliminada); 
      return
    }
    res.status(404).send({ message: 'Película no encontrada' }); 
   }

  @Post(':id/like')
  async darLike(@Param('id') id: number):Promise<Pelicula>{
    return this.peliculaService.darLike(+id);
  }



}
