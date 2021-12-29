import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interface/desafio.interface';

@Injectable()
export class DesafiosService {
  private readonly logger = new Logger(DesafiosService.name);

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { jogadores, solicitante } = criarDesafioDto;

    const solicitanteValido = jogadores.includes(solicitante);

    if (!solicitanteValido) {
      throw new BadRequestException(
        `Falha ao marcar desafio, solicitante ${solicitante} não é um dos jogadores`,
      );
    }

    await this._checarIdJogadorCadastrado(jogadores[0]);
    await this._checarIdJogadorCadastrado(jogadores[1]);

    const categoriaSolicitante =
      await this.categoriasService.consultarCategoriaJogador(solicitante);

    if (!categoriaSolicitante) {
      throw new BadRequestException(
        `Falha ao marcar desafio, solicitante ${solicitante} não está em nenhuma categoria`,
      );
    }

    const desafioCriado = await this._criar(
      criarDesafioDto,
      categoriaSolicitante,
    );

    this.logger.log(`Desafio criado: ${desafioCriado._id}`);

    return desafioCriado;
  }

  private async _criar(
    criarDesafioDto: CriarDesafioDto,
    categoria: Categoria,
  ): Promise<Desafio> {
    const desafioCriado = new this.desafioModel({
      ...criarDesafioDto,
      categoria: categoria.categoria,
      dataHoraSolicitacao: new Date().toISOString(),
      status: 'PENDENTE',
    });

    await desafioCriado.save();

    return desafioCriado;
  }

  private async _checarIdJogadorCadastrado(jogador: string): Promise<void> {
    const jogadorEncontrado =
      await this.jogadoresService.consultarJogadorPeloId(jogador);

    if (!jogadorEncontrado) {
      throw new BadRequestException(
        `Falha ao marcar desafio, jogador ${jogador} não encontrado`,
      );
    }
  }
}
