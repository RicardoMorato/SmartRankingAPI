import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criarJogadorDTO: CriarJogadorDto,
  ): Promise<Jogador> {
    const jogador = await this.jogadoresService.criarJogador(criarJogadorDTO);

    return jogador;
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPorId(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<Jogador> {
    const jogador = await this.jogadoresService.consultarJogadorPeloId(_id);

    return jogador;
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async atualizarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
    @Body()
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
  }

  @Delete('/:_id')
  @HttpCode(204)
  async deletarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    return await this.jogadoresService.deletarJogadorPeloId(_id);
  }
}
