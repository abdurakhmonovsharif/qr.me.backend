import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../entity/contact.entity';
import { ContactController } from '../controller/contact.controller';
import { ContactService } from '../service/contact.service';

@Module({
    imports: [TypeOrmModule.forFeature([Contact])],
    controllers: [ContactController],
    providers: [ContactService],
    exports:[ContactService]
})
export class ContactModule { }
