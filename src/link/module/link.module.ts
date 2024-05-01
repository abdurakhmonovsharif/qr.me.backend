import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../entity/link.entity';
import { LinkService } from '../service/link.service';
import { LinkController } from '../controller/link.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link]),],
  controllers: [LinkController],
  providers: [LinkService],
  exports:[LinkService]
})
export class LinkModule { }
