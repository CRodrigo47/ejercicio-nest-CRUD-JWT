import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AuthGuard } from './guards/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/usuarios/entities/usuario.entity';
import { Anuncio, AnuncioSchema } from 'src/anuncios/entities/anuncio.entity';
import { AnunciosService } from 'src/anuncios/anuncios.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Anuncio.name, schema: AnuncioSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "60s"
      }
    }),
  ],
  controllers: [AuthController],
  providers: [UsuariosService, AnunciosService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
