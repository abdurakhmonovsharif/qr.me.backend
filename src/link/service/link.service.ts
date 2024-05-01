import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../entity/link.entity';

@Injectable()
export class LinkService {
    constructor(
        @InjectRepository(Link)
        private linkRepository: Repository<Link>,
    ) { }

    async createLink(linkData: Partial<Link>): Promise<Link> {
        const newLink = this.linkRepository.create(linkData);
        return this.linkRepository.save(newLink);
    }
    async createLinkByPageId(pageId: string, linksData: Partial<Link>[]): Promise<Link[]> {
        const createdLinks: Link[] = [];

        for (const linkData of linksData) {
            const newLink = this.linkRepository.create({ ...linkData, page: { id: pageId } });
            const savedLink = await this.linkRepository.save(newLink);
            createdLinks.push(savedLink);
        }

        return createdLinks;
    }

    async getLinksByPageId(pageId: string): Promise<Link[]> {
        return this.linkRepository.find({ where: { page: { id: pageId } } });
    }



    async deleteLink(linkId: string): Promise<void> {
        await this.linkRepository.delete(linkId);
    }
    async deleteByPageId(pageId: string): Promise<void> {
        const links = await this.linkRepository.find({ where: { page: { id: pageId } } })
        await this.linkRepository.remove(links)
    }
}