import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RespostaLoginDto } from './dto/auth.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiOkResponse({ type: RespostaLoginDto })
  async login(@Body() dto: LoginDto): Promise<RespostaLoginDto> {
    return this.authService.login(dto);
  }
}
