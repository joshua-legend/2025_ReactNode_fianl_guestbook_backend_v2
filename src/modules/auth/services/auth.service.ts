import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import { hash, compare } from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(signUpDto: SignupDto) {
    const exists = await this.userRepository.findOne({
      where: { name: signUpDto.username },
    });

    if (exists) {
      throw new ConflictException('이미 존재하는 이름입니다.');
    }

    const hashedPassword = await hash(signUpDto.password, 10);

    const newUser = this.userRepository.create({
      name: signUpDto.username,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { name: loginDto.username } });
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다');

    const passwordMatches = await compare(loginDto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }
}
