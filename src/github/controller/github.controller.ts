import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GithubService } from '../service/github.service';
import { NetlifyService } from 'src/netlify/netlify.service';

@Controller('publish')
export class GitHubController {
    constructor(
        private readonly githubService: GithubService,
        private readonly netlifyService: NetlifyService,
      ) {}
    
      @Post()
      @UseInterceptors(FileInterceptor('file'))
      async publishToGithub(@UploadedFile() file: Express.Multer.File) {
        try {
          // Create repository on GitHub
          const repoName = this.generateRandomName();
          const repo = await this.githubService.createRepository(repoName);
    
          // Trigger deployment to Netlify
          const netlifyDeploy = await this.netlifyService.triggerDeploy(repo.name);
    
          return { success: true, message: 'Deployment initiated', repo, netlifyDeploy };
        } catch (error) {
          console.error('Error publishing to GitHub and Netlify:', error);
          return { success: false, message: 'Failed to publish', error };
        }
      }
    
      private generateRandomName(length: number = 10): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }
}
