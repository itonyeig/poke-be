import { Controller, Get } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonListResponse } from './interface/poki-api.interface';
import { ResponseFormatter } from 'src/common/response-formatter';
import { ApiTags } from '@nestjs/swagger';

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
}
