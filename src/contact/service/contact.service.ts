import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entity/contact.entity';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async findAll(): Promise<Contact[]> {
        return this.contactRepository.find();
    }

    async findOne(id: string): Promise<Contact> {
        return this.contactRepository.findOne({ where: { id } });
    }

    async create(contactData: Partial<Contact>): Promise<Contact> {
        const newContact = this.contactRepository.create(contactData);
        return this.contactRepository.save(newContact);
    }

    async update(id: string, contactData: Partial<Contact>): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ where: { id } });
        if (!contact) {
            throw new Error('Contact not found');
        }
        Object.assign(contact, contactData);
        return this.contactRepository.save(contact);
    }

    async delete(id: string): Promise<void> {
        const contact = await this.contactRepository.findOne({ where: { id } });
        if (!contact) {
            throw new Error('Contact not found');
        }
        await this.contactRepository.remove(contact);
    }
}
