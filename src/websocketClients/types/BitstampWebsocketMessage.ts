import { Expose } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { BitstampWebsocketMessageData } from './BitstampWebsocketMessageData';

export class BitstampWebsocketMessage {
  @Expose()
  @ValidateNested()
    data!: BitstampWebsocketMessageData;

  @Expose()
  @IsString()
    channel!: string;

  @Expose()
  @IsString()
    event!: string;
}
