import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonListResponse, PokemonResult } from './interface/poki-api.interface';


@Injectable()
export class PokemonService {
  private readonly pokeAxiosClient: AxiosInstance;
  private readonly pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor() {
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
}
