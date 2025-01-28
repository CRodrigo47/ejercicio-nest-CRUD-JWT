import { Injectable } from '@nestjs/common';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Anuncio } from './entities/anuncio.entity';
import { Model } from 'mongoose';

@Injectable()
export class AnunciosService {
  constructor(
    @InjectModel(Anuncio.name) private anuncioModel: Model<Anuncio>,
  ) {}

  create(createAnuncioDto: CreateAnuncioDto, userName: string) {
    const newAnuncio = new this.anuncioModel({...createAnuncioDto, usuario: userName});
    return newAnuncio.save();
  }

  findAll() {
    return this.anuncioModel.find().select('titulo').exec();
  }

  findOne(id: string) {
    return this.anuncioModel.findById(id).exec();
  }

  update(id: string, updateAnuncioDto: UpdateAnuncioDto) {
    return this.anuncioModel.findByIdAndUpdate(id, updateAnuncioDto).exec();
  }

  remove(id: string) {
    return this.anuncioModel.findByIdAndDelete(id).exec();
  }
}
