// netlify.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NetlifyService {
  private accessToken: string;

  constructor() {
    // Set your Netlify access token
    this.accessToken = 'nfp_tFDfXE9CzKCNZpea2JM3sMoPRSGtf3gsbfa1';
  }

  async triggerDeploy(repoName: string) {
    try {
      const response = await axios.post(
        `https://api.netlify.com/api/v1/sites/${repoName}/deploys`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error triggering deploy:', error);
      throw error;
    }
  }
}
