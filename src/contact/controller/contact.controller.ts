import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Contact } from '../entity/contact.entity';
import { ContactService } from '../service/contact.service';
import { UserService } from '../../users/service/user.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService,
  ) { }

  @Get()
  findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactService.findOne(id);
  }

  @Post()
  create(@Body() contactData: Partial<Contact>): Promise<Contact> {
    return this.contactService.create(contactData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() contactData: Partial<Contact>): Promise<Contact> {
    return this.contactService.update(id, contactData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contactService.delete(id);
  }
}
