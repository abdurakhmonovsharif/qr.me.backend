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
    async createLinkByPageId(linksData: Partial<Link>[], pageId: string): Promise<Link[]> {
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

    async updateLink(linkId: string, updatedData: Partial<Link>): Promise<Link> {
        await this.linkRepository.update(linkId, updatedData);
        return this.linkRepository.findOne({ where: { id: linkId } });
    }

    async deleteLink(linkId: string): Promise<void> {
        await this.linkRepository.delete(linkId);
    }
}