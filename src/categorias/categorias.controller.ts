import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { CategoriasService } from './categorias.service';
import { AtribuirJogadorCategoriaDto } from './dtos/atribuir-jogador-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPorNome(
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPorNome(categoria);
  }

  @Put('/:categoria')
  @HttpCode(204)
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,

    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(
      categoria,
      atualizarCategoriaDto,
    );
  }

  @Put('/atribuir/:categoria')
  @HttpCode(204)
  @UsePipes(ValidationPipe)
  async atribuirJogadorCategoria(
    @Param('categoria', ValidacaoParametrosPipe) categoria: string,
    @Body() atribuirJogadorCategoriaDto: AtribuirJogadorCategoriaDto,
  ): Promise<void> {
    await this.categoriasService.atribuirJogadorCategoria(
      categoria,
      atribuirJogadorCategoriaDto,
    );
  }
}
