import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CarteiraService } from './carteira.service';
import { CriarCarteiraDto } from './dto/carteira.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Carteira')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carteiras')
export class CarteiraController {
  constructor(private readonly carteiraService: CarteiraService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova carteira' })
  async criar(@Body() dto: CriarCarteiraDto, @Request() req) {
    const carteira = await this.carteiraService.criar(dto, req.user.id);
    const { usuario, ...resultado } = carteira as any;
    return resultado;
  }

  @Get()
  @ApiOperation({ summary: 'Listar carteiras do usuário autenticado' })
  async listar(@Request() req) {
    return this.carteiraService.listarPorUsuario(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar carteira por ID' })
  async buscar(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const carteira = await this.carteiraService.buscarPorId(id, req.user.id);
    const { usuario, ...resultado } = carteira as any;
    return resultado;
  }

  @Get(':id/resumo')
  @ApiOperation({ summary: 'Resumo financeiro — total investido, valor atual e rentabilidade' })
  async resumo(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const carteira = await this.carteiraService.buscarPorId(id, req.user.id);
    return this.carteiraService.calcularResumo(carteira);
  }
}
