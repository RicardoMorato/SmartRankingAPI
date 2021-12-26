import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const jogadorCriado = await this.criar(criarJogadorDto);

    this.logger.log(`Jogador criado: ${jogadorCriado._id}`);
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
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
}
