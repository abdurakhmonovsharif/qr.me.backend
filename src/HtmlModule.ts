import { Module } from '@nestjs/common';
import { HtmlController } from './HtmlController';

@Module({
  controllers: [HtmlController],
})
export class HtmlModule {}