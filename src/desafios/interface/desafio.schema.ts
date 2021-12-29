import * as mongoose from 'mongoose';

export const DesafioSchema = new mongoose.Schema(
  {
    dataHoraDesafio: Date,
    dataHoraSolicitacao: Date,
    dataHoraResposta: Date,
    status: String,
    categoria: String,
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jogador',
    },
    jogadores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador',
      },
    ],
    partida: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partida',
    },
  },
  { timestamps: true, collection: 'desafios' },
);
