import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { DesafioStatus } from '../interface/desafio-status.enum';

export class AtualizarDesafioDto {
  @IsOptional()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsOptional()
  @IsEnum(['ACEITO', 'NEGADO', 'CANCELADO'])
  status: DesafioStatus;
}
