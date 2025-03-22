import { LoginDto, CreateUserDto, ChangePasswordDto, UpdateUserDto} from '../dto/user.dto';
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isVerified: boolean; // Cuenta verificada, true si se verifico y false sino
    createdAt: Date; // Mostramos la fecha y hora de cuando se creo o modifico (actualizo) los registros (BD)
    refreshToken?: string;
    updatedAt: Date;
}

export interface UserService {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    verifyUser(id: string): Promise<User>;
    login(
        loginDto: LoginDto,
    ): Promise<{ accessToken: string; refreshToken: string; user: User }>;
    refreshToken(
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }>;
    changePassword(
        id: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void>;
}
