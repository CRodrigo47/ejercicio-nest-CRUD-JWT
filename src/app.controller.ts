import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "Go to /usuarios or /anuncios. Sign up or Log in in /auth/signup or /auth/login";
  }
}
