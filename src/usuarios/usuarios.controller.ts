import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDto, RespostaUsuarioDto } from './dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * UsuariosController — define as rotas HTTP para usuários.
 *
 * @Controller('usuarios'): equivalente ao @RestController + @RequestMapping do Spring.
 * @ApiTags: agrupa os endpoints no Swagger UI.
 * @ApiBearerAuth: indica que o endpoint requer token JWT no Swagger.
 *
 * No NestJS, os decorators de método são:
 * @Get, @Post, @Put, @Patch, @Delete — equivalentes ao @GetMapping, @PostMapping, etc.
 */
@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiCreatedResponse({ type: RespostaUsuarioDto })
  async registrar(@Body() dto: CriarUsuarioDto) {
    const usuario = await this.usuariosService.criar(dto);
    // Não retorna a senha — o @Exclude na entidade cuida disso
    const { senha, ...resultado } = usuario;
    return resultado;
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  async perfil(@Request() req) {
    // req.user é populado pelo JwtStrategy após validar o token
    return this.usuariosService.buscarPorId(req.user.id);
  }
}
