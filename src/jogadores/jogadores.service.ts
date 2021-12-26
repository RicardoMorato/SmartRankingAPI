import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const jogadorCriado = await this.criar(criarJogadorDto);

    this.logger.log(`Jogador criado: ${jogadorCriado._id}`);
  }

  async atualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

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
    return await this.jogadores;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado)
      throw new NotFoundException(`Jogador com email ${email} não encontrado`);

    return jogadorEncontrado;
  }

  async deletarJogadorPeloEmail(email: string): Promise<void> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!!jogadorEncontrado) {
      this.jogadores = this.jogadores.filter(
        (jogador) => jogador.email !== jogadorEncontrado.email,
      );

      this.logger.log(`Jogador deletado: ${jogadorEncontrado._id}`);
    } else {
      this.logger.warn(
        `Falhar ao deletar jogador com email ${email}, jogador não encontrado`,
      );

      throw new NotFoundException(`Jogador com email ${email} não encontrado`);
    }
  }

  private criar(criarJogadorDto: CriarJogadorDto): Jogador {
    const { nome, email, numeroTelefone } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      email,
      numeroTelefone,
      ranking: 'A',
      posicaoRanking: Math.floor(Math.random() * 100),
      urlFotoJogador: '',
    };

    this.jogadores.push(jogador);

    return jogador;
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): Jogador {
    const { nome } = criarJogadorDto;

    jogadorEncontrado.nome = nome;

    return jogadorEncontrado;
  }
}
