import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


// Clases alias para mi vistas como métodos en los cuales tienen ciertos
// atributos y validaciones de campos 

export class CreateUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class LoginUserDTO {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ChangePasswordDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(8, {message: "La nueva contrasela ingresada debe de tener un minimo de 8 caracteres"})
    newPassword: string;
}