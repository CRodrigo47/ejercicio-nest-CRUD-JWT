import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AnunciosService } from 'src/anuncios/anuncios.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject() private jwtService: JwtService,
    @Inject() private usuarioService: UsuariosService,
    @Inject() private anuncioService: AnunciosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenByHeader(request);
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['usuario'] = payload;
      const usuario = request.usuario;
      const idAnuncio = request.params.id;
      
      const usuarioAuth = await this.usuarioService.findByUsername(
        usuario.username,
      );
      if (!usuarioAuth)
        throw new UnauthorizedException('Usuario no encontrado');

      const anuncioAuth = await this.anuncioService.findOne(idAnuncio);
      if (!anuncioAuth){
        if(request.method == "POST"){
            return true
        }else{
            throw new UnauthorizedException("Anuncio no encontrado")
        }
      }

      if(request.method == "GET"){
        return true
      }

      if (
        usuarioAuth.rol === 'admin' || usuarioAuth.username === anuncioAuth.usuario
      ) {
        return true;
      }
    } catch (error){
        console.error(error)
      throw new UnauthorizedException("O te has equivocado de token, o se te ha puesto malo...");
    }
  }

  private extractTokenByHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return ( type === "Bearer" ? token : undefined );
  }
}
