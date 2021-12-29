import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this._buscarCategoriaPorNome(categoria);

    if (categoriaEncontrada) {
      throw new BadRequestException(
        `A categoria ${categoria} já foi cadastrada previamente`,
      );
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);

    return await categoriaCriada.save();
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

  async _buscarCategoriaPorNome(categoria: string): Promise<Categoria> {
    return await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();
  }
}
