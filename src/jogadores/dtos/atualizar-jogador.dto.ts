import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty()
  readonly numeroTelefone: string;

  @IsNotEmpty()
  readonly nome: string;
}
