import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type FavoritePokemonDocument = FavoritePokemon & Document<Types.ObjectId>;

@Schema({
  timestamps: true,
  collection: 'favorite-pokemon',
})
export class FavoritePokemon {
  @Prop({ required: true, unique: true })
  pokemonId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  types: string[];

  @Prop({ type: [String], default: [] })
  abilities: string[];

//   @Prop({
//     type: [
//       {
//         id: Number,
//         is_default: Boolean,
//         url: String,
//       } satisfies SchemaDefinition<Evolution>,
//     ],
//     default: [],
//   })
//   evolutions: Evolution[];
}

export const FavoritePokemonSchema = SchemaFactory.createForClass(FavoritePokemon);
FavoritePokemonSchema.index({ pokemonId: 1 }, { unique: true });

