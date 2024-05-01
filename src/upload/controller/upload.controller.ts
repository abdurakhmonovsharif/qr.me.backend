import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp'; 
import { FirebaseService } from 'src/firebase/service/firebase.service';
import { Response, Express } from 'express';
import { ConfigService } from '@nestjs/config';
import * as  path from 'path';

@Controller('upload')
export class UploadController {
    constructor(private readonly firebaseService: FirebaseService, private readonly configService: ConfigService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).send({ message: 'Invalid file type. Only images are allowed.' });
        }

        try {
           
            let buffer = await sharp(file.buffer)
                .webp({ quality: 100, lossless: true })
                .toBuffer();

          
            if (!buffer) {
                console.warn('Lossless WEBP conversion failed. Falling back to lossy.');
                await sharp(file.buffer)
                    .webp({ quality: 90 }) 
                    .toBuffer()
                    .then((webpBuffer) => (buffer = webpBuffer));
            }

            const storage = this.firebaseService.getStorage();
            const bucket = storage.bucket();
            const originalFilename = file.originalname; 
            const timestamp = Date.now();
            const fileExtension = path.extname(file.originalname);
            const sanitizedFilename = `${timestamp}${fileExtension.replace(/\.[^.]+$/, '.webp')}`; 

            const fileUpload = bucket.file(sanitizedFilename);
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: 'image/webp',
                },
            });

            stream.on('error', (error) => {
                console.error(error);
                res.status(500).send({ message: 'Failed to upload file' });
            });

            stream.on('finish', () => {
                const fileURL = this.configService.get('BASE_URL') + 'upload/' + sanitizedFilename;
                res.send({ fileURL, originalFilename });
            });
            stream.end(buffer);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Failed to process image' });
        }
    }

    @Get(':fileName')
    async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
        try {
            const fileBuffer = await this.firebaseService.getFile(fileName);
            res.setHeader('Content-Type', 'image/webp'); // Set content type for WEBP
            res.send(fileBuffer);
        } catch (error) {
            res.status(500).send({ message: 'Failed to fetch file', error });
        }
    }
}