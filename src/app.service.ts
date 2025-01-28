import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Usa Usuarios o Anuncios con sus respectivos endpoints para utilizar la API';
  }
}
