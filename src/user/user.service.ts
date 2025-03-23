import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto, ChangePasswordDto, UpdateUserDto } from './dto/user.dto';
import { UserModel, UserDocument } from './schemas/user.schemas';
import { User, UserService as UserServiceInterface } from './interface/user.interface';

@Injectable()
export class UserService implements UserServiceInterface {
    private transporter;

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) {
        this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name } = createUserDto;

        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
        throw new ConflictException('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({
        email,
        password: hashedPassword,
        name,
        isVerified: false,
        role: 'user',
        verificationCode: Math.floor(100000 + Math.random() * 900000).toString(), 
        });

        if (user.verificationCode !== null) {
            await this.sendVerificationEmail(user.email, user.verificationCode);
        } else {
            throw new Error('Código de verificación no disponible');
        }

        await this.sendVerificationEmail(user.email, user.verificationCode);

        const savedUser = await user.save();
        return this.mapToUserInterface(savedUser.toObject());
    }

    async  verifyUser(email: string, code: string): Promise<User> {
        const user = await this.userModel.findOne({ email, verificationCode: code }).exec();
        if (!user) {
            throw new NotFoundException('Código de verificación inválido');
        }

        user.isVerified = true;
        user.verificationCode = null; // Limpia el código de verificación
        await user.save();

        return this.mapToUserInterface(user.toObject());
    }
    async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email }).exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.isVerified) {
        throw new UnauthorizedException('El usuario no está verificado');
        }

        const accessToken = this.jwtService.sign({ email: user.email, sub: user.id });
        const refreshToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save();

        return {
        accessToken,
        refreshToken,
        user: this.mapToUserInterface(user.toObject()),
        };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userModel.findOne({ refreshToken }).exec();
        if (!user) {
        throw new UnauthorizedException('Token de refresco inválido');
        }

        const accessToken = this.jwtService.sign({ email: user.email, sub: user.id });
        const newRefreshToken = this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '7d' });

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken, refreshToken: newRefreshToken };
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.userModel.findById(id).exec();
        if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new UnauthorizedException('Contraseña actual incorrecta');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    }

    async findAll(): Promise<User[]> {
        const users = await this.userModel.find().lean().exec();
        return users.map(user => this.mapToUserInterface(user));
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).lean().exec();

        if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return this.mapToUserInterface(user);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email }).lean().exec();

        if (!user) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
        }
        return this.mapToUserInterface(user);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true }).lean().exec();

        if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return this.mapToUserInterface(updatedUser);
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
    }

    private async sendVerificationEmail(email: string, code: string): Promise<void> {
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${code}`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    private mapToUserInterface(userDoc: any): User {
        return {
        id: userDoc._id ? userDoc._id.toString() : userDoc.id,
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role,
        code: userDoc.isVerified,
        isVerified: userDoc.isVerified,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
        refreshToken: userDoc.refreshToken,
        };
    }
}