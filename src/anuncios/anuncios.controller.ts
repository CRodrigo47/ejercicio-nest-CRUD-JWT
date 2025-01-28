import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AnunciosService } from './anuncios.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('anuncios')
export class AnunciosController {
  constructor(private readonly anunciosService: AnunciosService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAnuncioDto: CreateAnuncioDto, @Req() request: any) {
    const usuario = request.usuario
    const nombre = usuario.username
    return this.anunciosService.create(createAnuncioDto, nombre);
  }

  @Get()
  findAll() {
    return this.anunciosService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.anunciosService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnuncioDto: UpdateAnuncioDto) {
    return this.anunciosService.update(id, updateAnuncioDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anunciosService.remove(id);
  }
}
