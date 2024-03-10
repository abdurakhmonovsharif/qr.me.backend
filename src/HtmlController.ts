import { Controller, Get, Res } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';

@Controller("/html")
export class HtmlController {
    @Get()
    async sendHtmlFile(@Res() res) {
        const filePath = path.join(__dirname, '../src/index.html');

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const contentType = mime.lookup(filePath);

            res.set('Content-Type', contentType);
            res.send(fileContent);
        } catch (err) {
            // Handle file read or send error
            res.status(500).send('Internal Server Error');
        }
    }
}