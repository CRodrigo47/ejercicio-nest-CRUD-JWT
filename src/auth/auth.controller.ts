import { AnunciosService } from './../anuncios/anuncios.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject() private anunciosService: AnunciosService,
    @Inject() private usuariosService: UsuariosService,
    @Inject() private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signup(@Body() createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.password = await bcryptjs.hash(
      createUsuarioDto.password,
      10,
    );
    return this.usuariosService.create(createUsuarioDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.findByUsername(
      createUsuarioDto.username,
    );
    if (!usuario){
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
      

    const passOk = await bcryptjs.compare(
      createUsuarioDto.password,
      usuario.password,
    );

    if (!passOk){
      throw new HttpException('El token no coincide', HttpStatus.FORBIDDEN);
    }
      

    const payload = { username: usuario.username, rol: usuario.rol };
    const userToken = await this.jwtService.signAsync(payload);

    const userRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    return { access_token: userToken, refresh_token: userRefreshToken };
  }

  @Post('/refresh')
  async refresh(@Body() body) {
    const actual_refresh_token = body.refresh_token;
  
    if (!actual_refresh_token) {
      throw new UnauthorizedException('No se proporcionó el refresh token.');
    }
  
    try {
      // Verificamos el token de refresco
      const payload = await this.jwtService.verifyAsync(actual_refresh_token);
  
      // Creamos un nuevo access token y refresh token
      const newPayload = { username: payload.username, rol: payload.rol }; // Extraemos solo lo necesario
      const access_token = await this.jwtService.signAsync(newPayload); // Access token sin expiración corta
      const refresh_token = await this.jwtService.signAsync(newPayload, {
        expiresIn: '1h', // Duración del refresh token
      });
  
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
  }
}
