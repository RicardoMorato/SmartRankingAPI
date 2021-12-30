import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interface/desafio-status.enum';
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

  async consultarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafioModel.find().exec();
  }

  async consultarTodosDesafiosDeUmJogador(
    idJogador: string,
  ): Promise<Desafio[]> {
    await this._checarIdJogadorCadastrado(idJogador);

    const desafiosJogador = await this.desafioModel
      .find()
      .where('jogadores')
      .in([idJogador])
      .exec();

    if (desafiosJogador.length <= 0) {
      throw new NotFoundException(
        `Nenhum desafio encontrado para o jogador com id ${idJogador}`,
      );
    }

    return desafiosJogador;
  }

  async atualizarDesafio(
    idDesafio: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this._consultarDesafioPeloId(idDesafio);

    const { dataHoraDesafio, status } = atualizarDesafioDto;

    if (dataHoraDesafio) {
      if (desafioEncontrado.status === 'ACEITO')
        throw new BadRequestException(
          `Falha ao atualizar desafio, a data/hora do desafio não pode ser alterada após ele ser confirmado`,
        );

      const dataHoje = new Date();
      const dataDesafio = new Date(dataHoraDesafio);

      if (dataDesafio.getTime() < dataHoje.getTime()) {
        throw new BadRequestException(
          `Falha ao atualizar desafio, a data/hora do desafio não pode menor do que a data/hora atual`,
        );
      }

      desafioEncontrado.dataHoraDesafio = dataHoraDesafio;
    }

    if (status) {
      desafioEncontrado.status = status;

      if (status === 'ACEITO') desafioEncontrado.dataHoraResposta = new Date();
    }

    await desafioEncontrado.save();
  }

  async cancelarDesafio(idDesafio: string): Promise<void> {
    const desafioEncontrado = await this._consultarDesafioPeloId(idDesafio);

    const dataHoje = new Date();
    const dataDesafio = new Date(desafioEncontrado.dataHoraDesafio);

    if (dataDesafio.getTime() < dataHoje.getTime()) {
      throw new BadRequestException(
        `Falha ao cancelar desafio ${idDesafio}, não é possível cancelar um desafio que já aconteceu`,
      );
    }

    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await desafioEncontrado.save();
  }

  private async _criar(
    criarDesafioDto: CriarDesafioDto,
    categoria: Categoria,
  ): Promise<Desafio> {
    const desafioCriado = new this.desafioModel({
      ...criarDesafioDto,
      categoria: categoria.categoria,
      dataHoraSolicitacao: new Date().toISOString(),
      status: DesafioStatus.PENDENTE,
    });

    await desafioCriado.save();

    return desafioCriado;
  }

  private async _checarIdJogadorCadastrado(idJogador: string): Promise<void> {
    const jogadorEncontrado =
      await this.jogadoresService.consultarJogadorPeloId(idJogador);

    if (!jogadorEncontrado) {
      throw new BadRequestException(
        `Falha ao marcar desafio, jogador ${idJogador} não encontrado`,
      );
    }
  }

  private async _consultarDesafioPeloId(idDesafio: string): Promise<Desafio> {
    const desafioEncontrado = await this.desafioModel.findById(idDesafio);

    if (!desafioEncontrado) {
      throw new BadRequestException(
        `Falha ao atualizar desafio, desafio ${idDesafio} não encontrado`,
      );
    }

    return desafioEncontrado;
  }
}
