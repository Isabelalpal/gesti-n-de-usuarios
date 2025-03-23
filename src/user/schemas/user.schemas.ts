import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({
    timestamps: true, // Añade automáticamente createdAt y updatedAt
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id.toString(); // Convierte _id a id
            delete ret._id; // Elimina _id del objeto JSON
            delete ret.__v; // Elimina __v (versión) del objeto JSON
            delete ret.password; // No devolver la contraseña en las respuestas
            return ret;
    },
    },
})

export class UserModel {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ default: false })
    isVerified: boolean; // Indica si el usuario ha verificado su cuenta

    @Prop({type: String, dafault: null})
    verificationCode: string | null; // Código de verificación enviado por email

    @Prop()
    role: string; // Rol del usuario (puede ser 'user', 'admin', etc.)

    @Prop()
    refreshToken?: string; // Token de refresco para renovar el access token
}

export const UserSchema = SchemaFactory.createForClass(UserModel);