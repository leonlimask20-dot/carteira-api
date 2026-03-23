import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtivosService } from './ativos.service';
import { CriarAtivoDto, AtualizarPrecoDto } from './dto/ativo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Ativos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carteiras/:carteiraId/ativos')
export class AtivosController {
  constructor(private readonly ativosService: AtivosService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar ativo à carteira' })
  async adicionar(
    @Param('carteiraId', ParseIntPipe) carteiraId: number,
    @Body() dto: CriarAtivoDto,
    @Request() req,
  ) {
    return this.ativosService.adicionar(carteiraId, dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ativos da carteira' })
  async listar(
    @Param('carteiraId', ParseIntPipe) carteiraId: number,
    @Request() req,
  ) {
    return this.ativosService.listarPorCarteira(carteiraId, req.user.id);
  }

  @Patch(':id/preco')
  @ApiOperation({ summary: 'Atualizar preço atual do ativo' })
  async atualizarPreco(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarPrecoDto,
    @Request() req,
  ) {
    return this.ativosService.atualizarPreco(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover ativo da carteira' })
  async remover(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.ativosService.remover(id, req.user.id);
    return { mensagem: 'Ativo removido com sucesso' };
  }
}
