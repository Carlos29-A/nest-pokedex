import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // Inyectar el PokemonService
  constructor(
    private readonly http: AxiosAdapter,
    private readonly pokemonService: PokemonService
  ) { }

  async executeSeed() {

    this.pokemonService.deleteAll();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    })
    this.pokemonService.insertMany(pokemonToInsert);

    return "Seed Executed";
  }
}
