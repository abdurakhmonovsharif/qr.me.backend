// upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/service/firebase.service';
import { UploadController } from '../controller/upload.controller';

@Module({
  imports: [MulterModule.register()],
  providers: [FirebaseService],
  controllers: [UploadController],
})
export class UploadModule {}
