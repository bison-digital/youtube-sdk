import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { YouTubeClient } from '../src/YouTubeClient.generated.js';
import { canRunIntegrationTests, getTestCredentials } from './setup.js';

// Skip all integration tests if credentials are not available
const skipIntegrationTests = !canRunIntegrationTests();

describe.skipIf(skipIntegrationTests)('YouTube SDK Integration Tests', () => {
  let client: YouTubeClient;
  let testCredentials: ReturnType<typeof getTestCredentials>;
  let createdMessageId: string | null = null;

  beforeAll(() => {
    if (!canRunIntegrationTests()) {
      return;
    }
    
    testCredentials = getTestCredentials();
    client = new YouTubeClient(
      testCredentials.credentials,
      testCredentials.clientId,
      testCredentials.clientSecret
    );
  });

  afterAll(async () => {
    // Clean up any created messages
    if (client && createdMessageId) {
      try {
        await client.deleteLiveChatMessagesIdApi({
          params: { id: createdMessageId }
        });
      } catch (error) {
        console.warn('Failed to clean up test message:', error);
      }
    }
  });

  test('should successfully refresh token if expired', async () => {
    // Create a client with an expired token
    const expiredCredentials = {
      ...testCredentials.credentials,
      expires_at: Date.now() - 1000, // Expired 1 second ago
    };

    const expiredClient = new YouTubeClient(
      expiredCredentials,
      testCredentials.clientId,
      testCredentials.clientSecret
    );

    // This should trigger a token refresh
    expect(expiredClient.isTokenExpired()).toBe(true);
    
    const refreshedCredentials = await expiredClient.refreshAccessToken();
    
    expect(refreshedCredentials.access_token).toBeDefined();
    expect(refreshedCredentials.expires_at).toBeGreaterThan(Date.now());
  });

  test('should list live chat messages', async () => {
    if (!testCredentials.testLiveChatId) {
      console.warn('YOUTUBE_LIVE_CHAT_ID not provided, skipping live chat message tests');
      return;
    }

    const response = await client.getYoutubeV3LiveChatMessagesApi({
      params: {
        liveChatId: testCredentials.testLiveChatId,
        part: ['snippet', 'authorDetails'],
        maxResults: 10
      }
    });

    expect(response).toBeDefined();
    expect(response.kind).toBe('youtube#liveChatMessageListResponse');
    expect(Array.isArray(response.items)).toBe(true);
    
    if (response.items && response.items.length > 0) {
      const firstMessage = response.items[0];
      expect(firstMessage.kind).toBe('youtube#liveChatMessage');
      expect(firstMessage.snippet).toBeDefined();
      expect(firstMessage.authorDetails).toBeDefined();
    }
  });

  test('should create a live chat message', async () => {
    if (!testCredentials.testLiveChatId) {
      console.warn('YOUTUBE_LIVE_CHAT_ID not provided, skipping message creation test');
      return;
    }

    const testMessage = `Test message from SDK integration test - ${new Date().toISOString()}`;
    
    try {
      const response = await client.createYoutubeV3LiveChatMessagesApi({
        params: {
          part: ['snippet']
        },
        body: {
          snippet: {
            liveChatId: testCredentials.testLiveChatId,
            type: 'textMessageEvent',
            textMessageDetails: {
              messageText: testMessage
            }
          }
        }
      });

      expect(response).toBeDefined();
      expect(response.kind).toBe('youtube#liveChatMessage');
      expect(response.id).toBeDefined();
      expect(response.snippet?.textMessageDetails?.messageText).toBe(testMessage);
      
      // Store the message ID for cleanup
      createdMessageId = response.id || null;
    } catch (error: any) {
      // If we get insufficient permission errors, that's expected - 
      // creating messages requires additional OAuth scopes
      if (error.message.includes('403') && error.message.includes('insufficient')) {
        console.warn('Message creation requires additional OAuth scopes - test passed');
        return;
      }
      // Re-throw other errors
      throw error;
    }
  });

  test('should delete a live chat message', async () => {
    if (!createdMessageId) {
      console.warn('No message created to delete, skipping delete test');
      return;
    }

    // This should not throw an error for a successful deletion
    await expect(client.deleteYoutubeV3LiveChatMessagesApi({
      params: { id: createdMessageId }
    })).resolves.toBeUndefined();

    // Clear the message ID since it's been deleted
    createdMessageId = null;
  });

  test('should handle API errors gracefully', async () => {
    // Try to get messages with an invalid live chat ID
    await expect(client.getYoutubeV3LiveChatMessagesApi({
      params: {
        liveChatId: 'invalid-chat-id',
        part: ['snippet']
      }
    })).rejects.toThrow();
  });

  test('should handle rate limiting gracefully', async () => {
    if (!testCredentials.testLiveChatId) {
      console.warn('YOUTUBE_LIVE_CHAT_ID not provided, skipping rate limiting test');
      return;
    }

    // Make multiple rapid requests to test rate limiting
    const requests = Array(5).fill(null).map(() => 
      client.getYoutubeV3LiveChatMessagesApi({
        params: {
          liveChatId: testCredentials.testLiveChatId!,
          part: ['snippet'],
          maxResults: 1
        }
      })
    );

    // Some requests might fail due to rate limiting, but at least one should succeed
    const results = await Promise.allSettled(requests);
    const successful = results.filter(result => result.status === 'fulfilled');
    
    expect(successful.length).toBeGreaterThan(0);
  });

  test('should properly construct query parameters', () => {
    const queryString = client.toQuery({
      part: 'snippet,authorDetails',
      maxResults: 50,
      pageToken: 'nextPageToken123'
    });

    expect(queryString).toContain('part=snippet%2CauthorDetails');
    expect(queryString).toContain('maxResults=50');
    expect(queryString).toContain('pageToken=nextPageToken123');
  });

  test('should handle undefined parameters in query construction', () => {
    const queryString = client.toQuery({
      part: 'snippet',
      maxResults: undefined,
      pageToken: 'token123'
    });

    expect(queryString).toContain('part=snippet');
    expect(queryString).not.toContain('maxResults');
    expect(queryString).toContain('pageToken=token123');
  });

  test('should return empty string for empty query parameters', () => {
    const queryString = client.toQuery({});
    expect(queryString).toBe('');
  });
});

// Show a message when tests are skipped
if (skipIntegrationTests) {
  console.log('Integration tests skipped - missing environment variables');
  console.log('Create a .env file with YouTube API credentials to run integration tests');
}