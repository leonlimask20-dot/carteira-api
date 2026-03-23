import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { CriarUsuarioDto } from './dto/usuario.dto';

/**
 * UsuariosService — lógica de negócio para usuários.
 *
 * @Injectable(): torna a classe disponível para injeção de dependência.
 * É o equivalente ao @Service do Spring Boot.
 *
 * @InjectRepository(): injeta o repositório TypeORM para a entidade.
 * É o equivalente ao @Autowired de um JpaRepository no Spring.
 */
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async criar(dto: CriarUsuarioDto): Promise<Usuario> {
    const existe = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existe) {
      throw new ConflictException('Este email já está cadastrado');
    }

    // Nunca armazenar senha em texto puro — BCrypt com salt de custo 10
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepo.create({
      ...dto,
      senha: senhaHash,
    });

    return this.usuarioRepo.save(usuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  async buscarPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }
}
