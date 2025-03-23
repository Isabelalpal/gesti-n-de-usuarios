import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';


// Clases alias para mi vistas como métodos en los cuales tienen ciertos
// atributos y validaciones de campos 

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}
