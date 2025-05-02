import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignupDto) {
    const user = await this.authService.signUp(signUpDto);
    return { data: user, message: '회원가입 성공' };
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    return { data: { accessToken, username: user.name }, message: '로그인 성공' };
  }
}
