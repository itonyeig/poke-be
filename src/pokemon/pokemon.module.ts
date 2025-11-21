import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritePokemon, FavoritePokemonSchema } from './schema/favorite-pokemon.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FavoritePokemon.name, schema: FavoritePokemonSchema }])],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
