import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarJogador(@Body() criarJogadorDTO: CriarJogadorDto) {
    await this.jogadoresService.criarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      const jogador = await this.jogadoresService.consultarJogadorPeloEmail(
        email,
      );

      return jogador;
    } else {
      return await this.jogadoresService.consultarJogadores();
    }
  }

  @Put()
  @HttpCode(204)
  async atualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    await this.jogadoresService.atualizarJogador(criarJogadorDto);
  }

  @Delete()
  @HttpCode(204)
  async deletarJogador(@Query('email') email: string): Promise<void> {
    return await this.jogadoresService.deletarJogadorPeloEmail(email);
  }
}
