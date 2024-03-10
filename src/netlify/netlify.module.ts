import { Module } from '@nestjs/common';
import { NetlifyService } from './netlify.service';

@Module({
    imports: [],
    providers: [NetlifyService],
    controllers: [],
    exports:[NetlifyService]
})
export class NetlifyModule { }
