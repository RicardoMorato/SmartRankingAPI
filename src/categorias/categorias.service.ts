import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirJogadorCategoriaDto } from './dtos/atribuir-jogador-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name);

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (!!categoriaEncontrada) {
      throw new BadRequestException(
        `A categoria ${categoria} já foi cadastrada previamente`,
      );
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    await categoriaCriada.save();

    this.logger.log(`Categoria criada: ${categoriaCriada._id}`);

    return categoriaCriada;
  }

  async consultarTodasCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPorNome(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `A categoria ${categoria} não foi encontrada`,
      );
    }

    return categoriaEncontrada.populate('jogadores');
  }

  async consultarCategoriaJogador(idJogador: string): Promise<Categoria> {
    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    return await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in([idJogador])
      .exec();
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (!!categoriaEncontrada) {
      const categoriaAtualizada = await this.categoriaModel.findOneAndUpdate(
        { categoria },
        atualizarCategoriaDto,
      );

      this.logger.log(`Categoria atualizada: ${categoriaAtualizada._id}`);
    } else {
      throw new NotFoundException(
        `Falha ao atualizar categoria ${categoria}, categoria não encontrada`,
      );
    }
  }

  async atribuirJogadorCategoria(
    categoria: string,
    atribuirJogadorCategoriaDto: AtribuirJogadorCategoriaDto,
  ): Promise<void> {
    const { idJogador } = atribuirJogadorCategoriaDto;

    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `Falha ao cadastrar jogador ${idJogador} na categoria ${categoria}, categoria não encontrada`,
      );
    }

    const jogadorCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in([idJogador])
      .exec();

    if (jogadorCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Falha ao cadastrar jogador ${idJogador} na categoria ${categoria}, jogador já cadastrado na categoria ${categoria}`,
      );
    }

    categoriaEncontrada.jogadores.push(idJogador);
    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }

  private async _buscarCategoriaPorNome(categoria: string): Promise<Categoria> {
    return await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();
  }
}
