import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    @Prop()
    username: string

    @Prop()
    password: string;
  
    @Prop()
    rol: string;

    @Prop()
    nombre: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
