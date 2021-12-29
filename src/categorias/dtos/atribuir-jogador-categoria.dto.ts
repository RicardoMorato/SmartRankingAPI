import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AtribuirJogadorCategoriaDto {
  @IsNotEmpty()
  @IsMongoId()
  idJogador: string;
}
