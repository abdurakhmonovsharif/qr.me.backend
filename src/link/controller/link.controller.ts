import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Link } from '../entity/link.entity';
import { LinkService } from '../service/link.service';

@Controller('links')
export class LinkController {
    constructor(private readonly linkService: LinkService) { }

    @Post()
    async createLink(@Body() linkData: Partial<Link>): Promise<Link> {
        return this.linkService.createLink(linkData);
    }

    @Get(':pageId')
    async getLinksByPageId(@Param('pageId') pageId: string): Promise<Link[]> {
        return this.linkService.getLinksByPageId(pageId);
    }

    @Delete(':linkId')
    async deleteLink(@Param('linkId') linkId: string): Promise<void> {
        return this.linkService.deleteLink(linkId);
    }
}