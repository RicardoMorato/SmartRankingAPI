import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interface/desafio.interface';

@Controller('/api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarTodosDesafios(): Promise<Desafio[]> {
    return await this.desafiosService.consultarTodosDesafios();
  }

  @Get('/:idJogador')
  async consultarTodosDesafiosDeUmJogador(
    @Param('idJogador', ValidacaoParametrosPipe) idJogador: string,
  ): Promise<Desafio[]> {
    return await this.desafiosService.consultarTodosDesafiosDeUmJogador(
      idJogador,
    );
  }
}
