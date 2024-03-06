import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entity/page.entity';
import { SectionService } from 'src/sections/service/section.service';
import { ContactService } from 'src/contact/service/contact.service';
import { ThemeService } from 'src/themes/service/theme.service';
import { UserService } from 'src/users/service/user.service';
import { CreatePageDto } from '../dto/page.dto';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>,
        private readonly sectionService: SectionService,
        private readonly contactService: ContactService,
        private readonly themeService: ThemeService,
        private readonly usersService: UserService,

    ) { }

    async findAll(): Promise<Page[]> {
        return this.pageRepository.find();
    }

    async findOne(id: string): Promise<Page> {
        return this.pageRepository.findOne({ where: { id } });
    }

    async create(pageData: CreatePageDto): Promise<Page> {
        try {
            const contact = await this.contactService.create(pageData.contact);
            const user = await this.usersService.findById(pageData.userId);
            const theme = await this.themeService.findOne(pageData.themeId);
            const newPage = this.pageRepository.create({ ...pageData, contact, user, theme });
            const savedPage = await this.pageRepository.save(newPage);
            await this.sectionService.createSectionsByPageId(pageData.sections, savedPage.id);
            return savedPage;
        } catch (error) {
            throw new HttpException('Failed to create page', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, pageData: Partial<Page>): Promise<Page> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) {
            throw new Error('Page not found');
        }
        Object.assign(page, pageData);
        return this.pageRepository.save(page);
    }

    async delete(id: string): Promise<void> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) {
            throw new Error('Page not found');
        }
        await this.pageRepository.remove(page);
    }
}
