import * as mongoose from 'mongoose';

export const jogadorSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    numeroTelefone: String,
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
