import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { PageService } from "../service/page.service";
import { Page } from "../entity/page.entity";
import { CreatePageDto } from "../dto/page.dto";

@Controller("pages")
export class PageController {
    constructor(private readonly pageService: PageService) { }

    @HttpCode(200)
    @Get()
    async findAll(): Promise<Page[]> {
        return await this.pageService.findAll();
    }
    @Get("/ws/:user_id")
    async findByUserId(@Param("user_id") user_id: string) {
        return this.pageService.findByIdUserId(user_id);
    }
    @HttpCode(200)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Page> {
        return await this.pageService.findOne(id);
    }

    @HttpCode(201)
    @Post()
    async create(@Body() pageData: CreatePageDto): Promise<Page> {
        return await this.pageService.create(pageData);
    }
    @HttpCode(201)
    @Post("check_edit_password/:id")
    async checkPassword(@Param("id") id: string, @Body() data: { password: string }): Promise<boolean> {
        return await this.pageService.checkPassword(id, data.password);
    }
    @HttpCode(200)
    @Put(':id')
    async update(@Param('id') id: string, @Body() pageData: Partial<Page>): Promise<Page> {
        return await this.pageService.update(id, pageData);
    }

    @HttpCode(200)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return await this.pageService.delete(id);
    }

}
