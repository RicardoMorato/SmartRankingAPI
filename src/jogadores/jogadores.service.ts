import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const jogadorCriado = await this.criar(criarJogadorDto);

    this.logger.log(`Jogador criado: ${jogadorCriado._id}`);
  }

  async atualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this._buscarJogadorPorEmail(email);

    if (!!jogadorEncontrado) {
      const jogadorAtualizado = await this.atualizar(
        jogadorEncontrado,
        criarJogadorDto,
      );

      this.logger.log(`Jogador atualizado: ${jogadorAtualizado._id}`);
    } else {
      this.logger.warn(
        `Falhar ao atualizar jogador com email ${email}, jogador não encontrado`,
      );

      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
    }
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this._buscarJogadorPorEmail(email);

    if (!jogadorEncontrado)
      throw new NotFoundException(`Jogador com email ${email} não encontrado`);

    return jogadorEncontrado;
  }

  async deletarJogadorPeloEmail(email: string): Promise<void> {
    const jogadorEncontrado = await this._buscarJogadorPorEmail(email);

    if (!!jogadorEncontrado) {
      await this.deletar(jogadorEncontrado.email);

      this.logger.log(`Jogador deletado: ${jogadorEncontrado._id}`);
    } else {
      this.logger.warn(
        `Falhar ao deletar jogador com email ${email}, jogador não encontrado`,
      );

      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
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
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const { email } = jogadorEncontrado;

    return await this.jogadorModel.findOneAndUpdate({ email }, criarJogadorDto);
  }

  private async deletar(email: string): Promise<any> {
    return await this.jogadorModel.deleteOne({ email }).exec();
  }

  private async _buscarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    return jogadorEncontrado;
  }
}
