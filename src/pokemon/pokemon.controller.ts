import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ResponseFormatter } from 'src/common/response-formatter';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from './dto/id-param.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('pokemon')
@ApiTags('Pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('list')
  async getPokemonList() {
    const pokemonList = await this.pokemonService.getPokemonList();
    return ResponseFormatter.Ok({
      data: pokemonList,
    });
  }

  @Get('favorites')
  async listFavorites() {
    const favorites = await this.pokemonService.listFavorites();
    return ResponseFormatter.Ok({
      data: favorites,
    });
  }

  @Post('favorites')
  @ApiBody({ type: AddFavoriteDto })
  async addFavorite(@Body() payload: AddFavoriteDto) {
    const favorite = await this.pokemonService.addFavorite(payload.pokemonId);
    return ResponseFormatter.Ok({
      data: favorite,
      message: 'Pokemon added to favorites',
    });
  }

  @Delete('favorites/:id')
  @ApiParam({ name: 'id', type: Number, description: 'Pokemon ID' })
  async removeFavorite(@Param() params: IdParamDto) {
    const favorite = await this.pokemonService.removeFavorite(params.id);
    return ResponseFormatter.Ok({
      data: favorite,
      message: 'Pokemon removed from favorites',
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Pokemon ID' })
  async getPokemonById(@Param() params: IdParamDto) {
    const pokemon = await this.pokemonService.getPokemonById(params.id);
    return ResponseFormatter.Ok({
      data: pokemon,
    });
  }
}
