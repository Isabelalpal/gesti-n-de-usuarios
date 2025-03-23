import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel, UserSchema } from '../user/schemas/user.schemas';

@Module({
imports: [
    // Registra el esquema de usuario en Mongoose
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),

    // Configura Passport para autenticación
    PassportModule,

    // Configura JWT para la generación de tokens
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Clave secreta para firmar los tokens
      signOptions: { expiresIn: '1h' }, // Expiración del token
    }),
],
  controllers: [UserController], // Registra el controlador
  providers: [UserService], // Registra el servicio
  exports: [UserService], // Exporta el servicio para su uso en otros módulos
})
export class UsersModule {}