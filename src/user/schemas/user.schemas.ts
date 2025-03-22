import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
            delete ret.password;

            return ret;
        },
    },
})

export class UserModel {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({requerid: true})
    password: string;

    @Prop({required: true})
    name: string;

    @Prop({default: false})
    isVerified: boolean;
    vereficacionCode: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);