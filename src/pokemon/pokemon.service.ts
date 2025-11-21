import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonApiResponse, PokemonListResponse, PokemonResult } from './interface/poki-api.interface';
import { FavoritePokemon, FavoritePokemonDocument } from './schema/favorite-pokemon.schema';


@Injectable()
export class PokemonService {
  private readonly pokeAxiosClient: AxiosInstance;
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(
    @InjectModel(FavoritePokemon.name)
    private readonly favoritePokemonModel: Model<FavoritePokemonDocument>,
  ) {
    this.pokeAxiosClient = axios.create({
      baseURL: this.pokemonApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getPokemonList(limit: number = 150, offset: number = 0): Promise<PokemonResult[] | null> {
    try {
      const response = await this.pokeAxiosClient.get<PokemonListResponse>(`/?limit=${limit}&offset=${offset}`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon list');
      }
      return data.results;
    } catch (error: any) {
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to fetch data');
    }
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    try {
      const response = await this.pokeAxiosClient.get<PokemonApiResponse>(`/${id}`);
      const data = response.data;
      if (response.status !== 200 || !data) {
        throw new BadRequestException('Failed to get pokemon');
      }
      const result = {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
        abilities: data.abilities.map((ability) => ability.ability.name),
        evolutions: data.evolutions,
        image: data.sprites.front_default,
        // stats: data.stats.map((stat) => stat.base_stat),
        // moves: data.moves.map((move) => move.move.name),
        // sprites: data.sprites.front_default,
        // height: data.height,
        // weight: data.weight,
      };
      return result;
    }
    catch (error: any) {
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to fetch data');
    }
  }

  async listFavorites(): Promise<FavoritePokemon[]> {
    return this.favoritePokemonModel.find().sort({ createdAt: -1 }).lean();
  }

  async addFavorite(pokemonId: number): Promise<FavoritePokemon> {
    const pokemon = await this.getPokemonById(pokemonId);

    try {
      const favorite = await this.favoritePokemonModel.create({
        pokemonId: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        abilities: pokemon.abilities,
        evolutions: pokemon.evolutions ?? [],
      } satisfies FavoritePokemon);

      return favorite.toObject();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Pokemon is already in favorites');
      }
      const err = error?.response?.data || error;
      throw new BadRequestException(err?.message || 'Failed to add favorite');
    }
  }

  async removeFavorite(pokemonId: number): Promise<FavoritePokemon> {
    const deleted = await this.favoritePokemonModel.findOneAndDelete({ pokemonId }).lean();
    if (!deleted) {
      throw new NotFoundException('Pokemon is not in favorites');
    }
    return deleted;
  }
}
