import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { DesafioStatus } from './desafio-status.enum';

export interface Desafio extends Document {
  dataHoraDesafio: Date;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: string;
  categoria: string;
  jogadores: string[];
  status: DesafioStatus;
  partida: Partida;
}

export interface Partida extends Document {
  categoria: string;
  jogadores: string[];
  def: Jogador;
  resultado: Resultado[];
}

export interface Resultado {
  set: string;
}
