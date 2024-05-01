import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entity/page.entity';
import { SectionService } from 'src/sections/service/section.service';
import { ContactService } from 'src/contact/service/contact.service';
import { ThemeService } from 'src/themes/service/theme.service';
import { UserService } from 'src/users/service/user.service';
import { CreatePageDto, UserPage } from '../dto/page.dto';
import { LinkService } from 'src/link/service/link.service';
import fetch from 'node-fetch';
import imageSize from 'image-size';
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
        const page = await this.pageRepository.findOne({
            where: { id },
            relations: ['contact', 'theme', 'sections', 'sections.sliders', 'links']
        });
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        delete page.last_view_date;
        return page;
    }
    async checkPassword(id: string, password: string): Promise<void> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        if (page.password_edit !== password) throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
    }
    async checkViewPassword(id: string, password: string): Promise<void> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        if (page.password_view !== password) throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
    }
    async create(pageData: CreatePageDto): Promise<{ url: string }> {
        const existsPage = await this.pageRepository.findOne({ where: { user: { id: pageData.userId } } });
        if (existsPage) {
            throw new HttpException('Page already exists', HttpStatus.FORBIDDEN);
        }
        const estimatedSize = await this.estimatePageSize(pageData);
        const sizeLimit = await this.getSizeLimit(pageData.type);
        if (estimatedSize > sizeLimit) {
            throw new HttpException('Page size exceeds limit', HttpStatus.BAD_REQUEST);
        }
        try {
            const contact = await this.contactService.create(pageData.contact);
            const user = await this.usersService.findById(pageData.userId);
            const theme = await this.themeService.findOne(pageData.themeId);
            const newPage = this.pageRepository.create({ ...pageData, contact, user, theme });
            newPage.size = estimatedSize as unknown as string
            const savedPage = await this.pageRepository.save(newPage);
            await this.sectionService.createSectionsByPageId(pageData.sections, savedPage.id);
            await this.linkService.createLinkByPageId(savedPage.id, pageData.links)
            await this.usersService.update(user.id, { ...user, page: savedPage })
            return { url: user.url };
        } catch (error) {
            console.log(error);
            throw new HttpException('Failed to create page', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getStringSize(str: string): number {
        return str ? str.length * 2 : 0;
    }
    async estimatePageSize(pageData: CreatePageDto): Promise<number> {
        let totalSize = 0;

        for (const section of pageData.sections) {
            totalSize += this.getStringSize(section.title);
            totalSize += this.getStringSize(section.content);

            if (section.type === "sliders" && section.sliders) {
                for (const slide of section.sliders) {
                    totalSize += this.getStringSize(slide.title);
                }
            }
        }

        const totalSizeKB = totalSize / 1024;
        return Math.floor(totalSize);
    }
    async getSizeLimit(type: string) {
        if (type === 'blog') {
            return 5 * 1024 * 1024; // 5 MB
        } else if (type === 'text' || type === "image") {
            return 200 * 1024; // 200 KB
        } else {
            // Default limit or throw an error
        }
    }
    async update(id: string, pageData: CreatePageDto): Promise<{ url: string }> {
        const page = await this.pageRepository.findOne({ where: { id }, relations: ["user"] });
        if (!page) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        const estimatedSize = await this.estimatePageSize(pageData);
        const sizeLimit = await this.getSizeLimit(pageData.type);
        if (estimatedSize > sizeLimit) {
            throw new HttpException('Page size exceeds limit', HttpStatus.BAD_REQUEST);
        }
        if (page.edited_count >= page.max_edit_count) {
            page.user.block = true;
            await this.usersService.update(page.user.id, page.user)
            throw new HttpException('Page edit limit reached. Maximum edits allowed: ' + page.max_edit_count, HttpStatus.BAD_REQUEST);
        }
        Object.assign(page, pageData);
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours() + 5).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(6, '0');
        page.updated_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
        page.size = estimatedSize as unknown as string
        await this.contactService.update(page.contact.id, page.contact);
        await this.sectionService.update(page.id, pageData.sections);
        await this.linkService.deleteByPageId(page.id);
        await this.linkService.createLinkByPageId(page.id, page.links)
        page.edited_count++
        await this.pageRepository.save(page);
        return { url: page.user.url }
    }
    async findByIdUserId(url: string): Promise<UserPage> {
        const user = await this.usersService.findByURL(url);
        if (!user) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        if (!user.active || user.block) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        const page = await this.pageRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['contact', 'theme', 'sections', 'sections.sliders', 'links']
        });
        if (!page) {
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        if (page.view_count !== page.max_view_count) {
            page.view_count++;
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0');
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours() + 5).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            const milliseconds = String(now.getUTCMilliseconds()).padStart(6, '0');
            page.last_view_date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
        } else {
            user.active = false;
            await this.usersService.update(user.id, user)
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }

        if (new Date(page.start_date) === new Date(page.end_date)) {
            user.active = false;
            await this.usersService.update(user.id, user);
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        }
        await this.pageRepository.save(page);
        return { id: page.id, has_password: page.password_view !== "", contact: page.contact, links: page.links, sections: page.sections, theme: page.theme, url: user.url, type: page.type };
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
