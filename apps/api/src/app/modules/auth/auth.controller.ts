import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthResponseDto } from './dto/CreateUserResponse.dto';
import { LoginUserDto } from './dto/LoginUser.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiBadRequestResponse({ description: 'DTO badly formed' })
  signup(@Body() userRequest: CreateUserDto): Promise<void> {
    return this.authService.createUser(userRequest);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiCreatedResponse({
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'DTO badly formed' })
  login(@Body() userRequest: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.loginUser(userRequest);
  }
}
