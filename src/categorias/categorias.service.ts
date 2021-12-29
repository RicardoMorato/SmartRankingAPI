import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name);

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
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
    return await this.categoriaModel.find().exec();
  }

  async consultarCategoriaPorNome(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `A categoria ${categoria} não foi encontrada`,
      );
    }

    return categoriaEncontrada;
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
      this.logger.warn(
        `Falha ao atualizar categoria ${categoria}, categoria não encontrada`,
      );

      throw new NotFoundException(
        `Falha ao atualizar categoria ${categoria}, categoria não encontrada`,
      );
    }
  }

  private async _buscarCategoriaPorNome(categoria: string): Promise<Categoria> {
    return await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();
  }
}
