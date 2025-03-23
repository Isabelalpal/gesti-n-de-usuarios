import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, ChangePasswordDto, UpdateUserDto } from '../user/dto/user.dto';
import { User } from '../user/interface/user.interface';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Post('verify-email')
    async verifyEmail(
        @Body('email') email: string,
        @Body('code') code: string,
    ): Promise<User> {
        return this.userService.verifyUser(email, code);
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
    ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        return this.userService.login(loginDto);
    }

    @Post('refresh-token')
    async refreshToken(
        @Body('refreshToken') refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        return this.userService.refreshToken(refreshToken);
    }

    @Put('change-password/:id')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        return this.userService.changePassword(id, changePasswordDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }
}