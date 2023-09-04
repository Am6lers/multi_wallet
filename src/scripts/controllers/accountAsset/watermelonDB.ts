import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators';
import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

export const TokenInfos = 'TokenInfos';
export const TokenTable = 'tokens';

export interface TokenInfo {
  Address: string;
  Name: string;
  Symbol: string;
  Decimals: number;
}

export default class Token extends Model {
  static table = TokenTable;

  @field('chain_id') chainId!: string;
  @field('address') address!: string;
  @field('name') name!: string;
  @field('symbol') symbol!: string;
  @field('decimals') decimals!: number;
  // static columns = ['chain_id', 'address', 'name', 'symbol', 'decimals'];
}

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TokenTable,
      columns: [
        { name: 'chain_id', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'decimals', type: 'number' },
      ],
    }),
  ],
});

const adapter = new SQLiteAdapter({
  // dbName: TokenInfos,
  dbName: TokenTable,
  schema: mySchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Token],
});
