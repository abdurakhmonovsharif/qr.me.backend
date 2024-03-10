import { Module } from '@nestjs/common';
import { GitHubController } from '../controller/github.controller';
import { GithubService } from '../service/github.service';
import { NetlifyModule } from 'src/netlify/netlify.module';

@Module({
    imports: [NetlifyModule],
    providers: [GithubService],
    controllers: [GitHubController],
})
export class GitHubModule { }
