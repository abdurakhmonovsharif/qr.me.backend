import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entity/page.entity';
import { SectionService } from 'src/sections/service/section.service';
import { ContactService } from 'src/contact/service/contact.service';
import { ThemeService } from 'src/themes/service/theme.service';
import { UserService } from 'src/users/service/user.service';
import { CreatePageDto } from '../dto/page.dto';
import { LinkService } from 'src/link/service/link.service';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>,
        private readonly sectionService: SectionService,
        private readonly contactService: ContactService,
        private readonly themeService: ThemeService,
        private readonly usersService: UserService,
        private readonly linkService: LinkService,
    ) { }

    async findAll(): Promise<Page[]> {
        return this.pageRepository.find();
    }

    async findOne(id: string): Promise<Page> {
        return this.pageRepository.findOne({ where: { id } });
    }
    async checkPassword(id: string, password: string): Promise<boolean> {
        console.log(password);
        
        const page = await this.pageRepository.findOne({ where: { id } })
        return page.password_edit === password;
    }
    async create(pageData: CreatePageDto): Promise<Page> {
        const existsPage = await this.pageRepository.findOne({ where: { user: { id: pageData.userId } } });
        if (existsPage) {
            throw new HttpException('Page already exists', HttpStatus.FORBIDDEN);
        }
        try {
            const contact = await this.contactService.create(pageData.contact);
            const user = await this.usersService.findById(pageData.userId);
            const theme = await this.themeService.findOne(pageData.themeId);
            const newPage = this.pageRepository.create({ ...pageData, contact, user, theme });
            const savedPage = await this.pageRepository.save(newPage);
            await this.sectionService.createSectionsByPageId(pageData.sections, savedPage.id);
            await this.linkService.createLinkByPageId(pageData.links, savedPage.id)
            await this.usersService.update(user.id, { ...user, page: savedPage })
            return savedPage;
        } catch (error) {
            console.log(error);
            throw new HttpException('Failed to create page', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByIdUserId(url: string) {
        const user = await this.usersService.findByURL(url);
        if (!user) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        if (!user.active || user.block) {
            throw new HttpException('Page not found', HttpStatus.FORBIDDEN);
        }
        const userWithOutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            url: user.url,
            plan: user.plan.name
        }
        const page = await this.pageRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['contact', 'theme', 'sections', 'sections.sliders', 'links']
        });
        if (!page) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        if (page.view_count !== page.max_view_count) {
            page.view_count++
        } else {
            user.active = false;
            await this.usersService.update(user.id, user)
        }

        if (page.start_date > page.end_date) {
            user.active = false;
            await this.usersService.update(user.id, user)
        }
        await this.pageRepository.save(page);
        return { ...page, user: userWithOutPassword };
    }
    async update(id: string, pageData: Partial<Page>): Promise<Page> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) {
            throw new Error('Page not found');
        }

        Object.assign(page, pageData);

        page.updated_at = new Date().toISOString();

        return this.pageRepository.save(page);
    }

    async delete(id: string): Promise<void> {
        const page = await this.pageRepository.findOne({
            where: { id },
            relations: ['contact', 'sections', 'sections.sliders', 'links', "user"]
        });
        if (!page) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        page.user.page = null;
        await this.usersService.update(page.user.id, page.user);
        await this.sectionService.deleteByPageId(page.id);
        await this.pageRepository.remove(page);
        await this.contactService.delete(page.contact.id);
        await this.linkService.deleteByPageId(page.id);
    }
}
