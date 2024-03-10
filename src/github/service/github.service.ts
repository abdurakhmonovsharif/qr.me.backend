import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';

@Injectable()
export class GithubService {
  private octokit: Octokit;
  private owner: string = 'abdurakhmonovsharif'; // Replace with your GitHub username
  private repo: string = 'your_repository';

  constructor() {
    this.octokit = new Octokit({
      auth: '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', // Your GitHub access token
    });
  }

  // async createRepository(repoName: string) {
  //   try {
  //     const response = await this.octokit.repos.createForAuthenticatedUser({
  //       name: repoName,
  //       auto_init: true, // Initialize with a README file
  //     });
  //     this.repo = repoName; // Update the repo property with the newly created repository name
  //     console.log('Repository created:', response.data.html_url);
  //     return { success: true, message: 'Repository created successfully', url: response.data.html_url };
  //   } catch (error) {
  //     console.error('Error creating repository:', error);
  //     return { success: false, message: 'Failed to create repository', error };
  //   }
  // }
  async createRepository(repoName: string) {
    try {
      const response = await this.octokit.repos.createForAuthenticatedUser({
        name: repoName,
        auto_init: true, // Initialize with a README file
      });
      return response.data;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  }
  // async deployHtmlFile(filePath: string, htmlContent: string) {
  //   try {
  //     const repository = await this.createRepository(this.generateRandom(15))
  //     if (repository.success) {
  //       const content = Buffer.from(htmlContent).toString('base64');
  //       const response = await this.octokit.repos.createOrUpdateFileContents({
  //         owner: this.owner,
  //         repo: this.repo,
  //         path: filePath,
  //         message: 'Add HTML file',
  //         content,
  //       });

  //       if (response.status === 200 || response.status === 201) {
  //         // If file creation/update is successful, trigger GitHub Pages deployment
  //         await this.triggerPagesDeployment();
  //         const deploymentUrl = `https://${this.owner}.github.io/${this.repo}`;
  //         return { success: true, message: 'HTML file deployed successfully', url: deploymentUrl };
  //       } else {
  //         return { success: false, message: 'Failed to deploy HTML file' };
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error deploying HTML file:', error);
  //     return { success: false, message: 'Failed to deploy HTML file', error };
  //   }
  // }
  // generateRandom(length: number) {
  //   const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  //   let domain = '';
  //   for (let i = 0; i < length; i++) {
  //     domain += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  //   return domain
  // }
  // async triggerPagesDeployment() {
  //   try {
  //     await this.octokit.repos.createDispatchEvent({
  //       owner: this.owner,
  //       repo: this.repo,
  //       event_type: 'deploy_pages', // Name of the GitHub Actions workflow to deploy GitHub Pages
  //     });
  //     console.log('GitHub Pages deployment triggered successfully');
  //   } catch (error) {
  //     console.error('Error triggering GitHub Pages deployment:', error);
  //   }
  // }
}
