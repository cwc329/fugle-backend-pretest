import { Expose } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

type TradeType = 1 | 0; // (0 - buy; 1 - sell).

export class BitstampWebsocketMessageData {
  @Expose()
  @IsNumber()
    id!: number;

  @Expose()
  @IsNumber()
    amount!: number;

  @Expose()
  @IsString()
    amount_str!: string;

  @Expose()
  @IsNumber()
    price!: number;

  @Expose()
  @IsString()
    price_str!: string;

  @Expose()
  @IsIn([1, 0])
    type!: TradeType;

  @Expose()
  @IsNumber()
    timestamp!: number;

  @Expose()
  @IsNumber()
    microtimestamp!: number;

  @Expose()
  @IsNumber()
    buy_order_id!: number;

  @Expose()
  @IsNumber()
    sell_order_id!: number;
}
