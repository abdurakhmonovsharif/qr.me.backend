import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { FirebaseService } from 'src/firebase/service/firebase.service';
import { Response, Express } from 'express';
import { ConfigService } from '@nestjs/config';
@Controller('upload')
export class UploadController {
    constructor(private readonly firebaseService: FirebaseService, private readonly configService: ConfigService) { }
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const storage = this.firebaseService.getStorage();
        const bucket = storage.bucket();
        
        // Generate new filename with timestamp and file's MIME type
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); // Get the file extension
        const sanitizedFilename = `${timestamp}${fileExtension}`;
        
        const fileUpload = bucket.file(sanitizedFilename);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
    
        stream.on('error', (error) => {
            console.error(error);
        });
    
        stream.on('finish', () => {
            console.log(`File ${sanitizedFilename} uploaded successfully.`);
        });
    
        stream.end(file.buffer);
        
        let fileURL: string;
        if (file.mimetype === 'text/html') {
            fileURL = this.configService.get('BASE_URL') + 'upload/html/' + sanitizedFilename;
        } else {
            fileURL = this.configService.get('BASE_URL') + 'upload/' + sanitizedFilename;
        }
        
        return { fileURL };
    }
    @Get(':fileName')
    async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
        try {
            const fileBuffer = await this.firebaseService.getFile(fileName);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'inline');
            res.send(fileBuffer);
        } catch (error) {
            res.status(500).send({ message: 'Failed to fetch file', error });
        }
    }
    @Get('html/:fileName')
    async getHtml(@Param('fileName') fileName: string, @Res() res: Response) {
        try {
            const fileBuffer = await this.firebaseService.getFile(fileName);
            res.setHeader('Content-Type', 'text/html');
            res.send(fileBuffer);
        } catch (error) {
            res.status(500).send({ message: 'Failed to fetch HTML file', error });
        }
    }
}
