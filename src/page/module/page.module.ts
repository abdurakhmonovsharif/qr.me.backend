import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from '../entity/page.entity';
import { PageController } from '../controller/page.controller';
import { PageService } from '../service/page.service';
import { SectionService } from 'src/sections/service/section.service';
import { SectionModule } from 'src/sections/module/section.module';
import { ContactModule } from 'src/contact/module/contact.module';
import { ThemesModule } from 'src/themes/module/theme.module';
import { UsersModule } from 'src/users/module/user.module';
import { LinkModule } from 'src/link/module/link.module';

@Module({
  imports: [TypeOrmModule.forFeature([Page]),SectionModule,ContactModule,ThemesModule,UsersModule,LinkModule],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule { }
