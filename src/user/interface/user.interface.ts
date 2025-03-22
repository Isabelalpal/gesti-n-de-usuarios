import { CreateUserDTO, LoginUserDTO, ChangePasswordDTO} from '../dto/user.dto';
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    isVerified: boolean; // Cuenta verificada, true si se verifico y false sino
    verificationCode: string; // Verificacion de codigo para la "Cuenta"
    createdAt: Date; // Mostramos la fecha y hora de cuando se creo o modifico (actualizo) los registros (BD)
    updatedAt: Date;
}

export interface UserService {
    register(CreateUserDTO: CreateUserDTO): Promise<User>;
    verifyEmail(email: string, code: string): Promise<User>;
    login(LoginUserDTO: LoginUserDTO): Promise<{acess_token: string}>;
    changePassword(email: string, ChangePaswordDTO: ChangePasswordDTO): Promise<User>;
    findAll(): Promise<User[]>;
    fingById(id: string): Promise<User>;
    
}