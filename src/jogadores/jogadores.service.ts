import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this._buscarJogadorPorEmail(email);

    if (!!jogadorEncontrado) {
      throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
    }

    const jogadorCriado = await this.criar(criarJogadorDto);

    this.logger.log(`Jogador criado: ${jogadorCriado._id}`);

    return jogadorCriado;
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this._buscarJogadorPorId(_id);

    if (!!jogadorEncontrado) {
      const jogadorAtualizado = await this.atualizar(
        jogadorEncontrado,
        atualizarJogadorDto,
      );

      this.logger.log(`Jogador atualizado: ${jogadorAtualizado._id}`);
    } else {
      this.logger.warn(
        `Falha ao atualizar jogador com id ${_id}, jogador não encontrado`,
      );

      throw new NotFoundException(
        `Falha ao atualizar jogador com id ${_id}, jogador não encontrado`,
      );
    }
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this._buscarJogadorPorId(_id);

    if (!jogadorEncontrado)
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);

    return jogadorEncontrado;
  }

  async deletarJogadorPeloId(_id: string): Promise<void> {
    const jogadorEncontrado = await this._buscarJogadorPorId(_id);

    if (!!jogadorEncontrado) {
      await this.deletar(_id);

      this.logger.log(`Jogador deletado: ${jogadorEncontrado._id}`);
    } else {
      this.logger.warn(
        `Falhar ao deletar jogador com id ${_id}, jogador não encontrado`,
      );

      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { nome, email, numeroTelefone } = criarJogadorDto;

    const creationBody = {
      nome,
      email,
      numeroTelefone,
      ranking: 'A',
      posicaoRanking: Math.floor(Math.random() * 100),
      urlFotoJogador: '',
    };

    const jogadorCriado = new this.jogadorModel(creationBody);

    await jogadorCriado.save();

    return jogadorCriado;
  }

  private async atualizar(
    jogadorEncontrado: Jogador,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<Jogador> {
    const { email } = jogadorEncontrado;

    return await this.jogadorModel.findOneAndUpdate({ email }, atualizarJogadorDto);
  }

  private async deletar(_id: string): Promise<any> {
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async _buscarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    return jogadorEncontrado;
  }

  private async _buscarJogadorPorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById({ _id }).exec();

    return jogadorEncontrado;
  }
}
