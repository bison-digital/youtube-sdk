import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

// Validate required environment variables
const requiredEnvVars = [
  'YOUTUBE_CLIENT_ID',
  'YOUTUBE_CLIENT_SECRET',
  'YOUTUBE_ACCESS_TOKEN',
  'YOUTUBE_REFRESH_TOKEN',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
  console.warn('Some tests may be skipped. Please check your .env file.');
}

// Helper to check if integration tests can run
export const canRunIntegrationTests = (): boolean => {
  return requiredEnvVars.every(varName => process.env[varName]);
};

// Helper to get test credentials
export const getTestCredentials = () => {
  if (!canRunIntegrationTests()) {
    throw new Error('Missing required environment variables for integration tests');
  }

  return {
    credentials: {
      access_token: process.env.YOUTUBE_ACCESS_TOKEN!,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN!,
      expires_at: parseInt(process.env.YOUTUBE_TOKEN_EXPIRES_AT || String(Date.now() + 3600000)),
      scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl',
      token_type: 'Bearer',
    },
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    testLiveChatId: process.env.YOUTUBE_LIVE_CHAT_ID,
  };
};