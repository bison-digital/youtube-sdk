# YouTube SDK

A TypeScript SDK for the YouTube Data API v3 with comprehensive Live Chat support. This package is automatically generated from the OpenAPI specification and published via GitHub Actions.

## Features

- 🚀 **TypeScript-first** - Full type safety and IntelliSense support
- 📺 **YouTube Live Chat** - Complete support for live chat operations
- 🔄 **Auto-generated** - Always up-to-date with the latest API spec
- 🌐 **Universal** - Works in Node.js, browsers, and Cloudflare Workers
- 📦 **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install @zbimson/youtube-sdk
```

## Quick Start

```typescript
import { YouTubeClient } from '@zbimson/youtube-sdk';

// Initialize the client
const youtube = new YouTubeClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://www.googleapis.com/youtube/v3'
});

// Get live chat messages
const messages = await youtube.getLiveChatMessagesApi({
  params: {
    liveChatId: 'your-live-chat-id',
    part: 'snippet,authorDetails'
  }
});

console.log('Live chat messages:', messages.items);
```

## API Reference

### YouTubeClient

The main client class for interacting with the YouTube API.

#### Constructor

```typescript
new YouTubeClient(options: {
  apiKey: string;
  baseUrl?: string;
})
```

#### Methods

##### Live Chat Messages

```typescript
// Get live chat messages
await youtube.getLiveChatMessagesApi({
  params: {
    liveChatId: string;
    part: string;
    hl?: string;
    maxResults?: number;
    pageToken?: string;
    profileImageSize?: number;
  }
});

// Send a live chat message
await youtube.createLiveChatMessagesApi({
  params: { part: 'snippet' },
  body: {
    snippet: {
      liveChatId: string;
      type: 'textMessageEvent';
      textMessageDetails: {
        messageText: string;
      };
    };
  }
});

// Delete a live chat message
await youtube.deleteLiveChatMessagesIdApi({
  params: { id: string }
});

// Moderate live chat messages
await youtube.createLiveChatMessagesTransitionApi({
  params: {
    id: string;
    status: 'held' | 'approved' | 'rejected';
  }
});
```

### Types

The SDK exports comprehensive TypeScript types for all API responses:

```typescript
import type {
  LiveChatMessage,
  LiveChatMessageListResponse,
  LiveChatMessageAuthorDetails,
  LiveChatTextMessageDetails,
  LiveChatSuperChatDetails,
  LiveChatSuperStickerDetails,
  // ... and many more
} from '@zbimson/youtube-sdk';
```

### Common Types

#### LiveChatMessage

```typescript
interface LiveChatMessage {
  kind: string;
  etag: string;
  id: string;
  snippet: LiveChatMessageSnippet;
  authorDetails: LiveChatMessageAuthorDetails;
}
```

#### LiveChatMessageListResponse

```typescript
interface LiveChatMessageListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  pollingIntervalMillis: number;
  pageInfo: PageInfo;
  items: LiveChatMessage[];
}
```

## Usage Examples

### Real-time Chat Monitoring

```typescript
import { YouTubeClient } from '@zbimson/youtube-sdk';

class LiveChatMonitor {
  private client: YouTubeClient;
  private liveChatId: string;
  private pageToken?: string;

  constructor(apiKey: string, liveChatId: string) {
    this.client = new YouTubeClient({ apiKey });
    this.liveChatId = liveChatId;
  }

  async startMonitoring() {
    while (true) {
      try {
        const response = await this.client.getLiveChatMessagesApi({
          params: {
            liveChatId: this.liveChatId,
            part: 'snippet,authorDetails',
            pageToken: this.pageToken
          }
        });

        // Process new messages
        for (const message of response.items) {
          this.handleMessage(message);
        }

        // Update page token for next request
        this.pageToken = response.nextPageToken;

        // Wait for the recommended polling interval
        await this.sleep(response.pollingIntervalMillis);
      } catch (error) {
        console.error('Error fetching messages:', error);
        await this.sleep(5000); // Wait 5 seconds on error
      }
    }
  }

  private handleMessage(message: LiveChatMessage) {
    const author = message.authorDetails.displayName;
    const text = message.snippet.textMessageDetails?.messageText;
    
    console.log(`${author}: ${text}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const monitor = new LiveChatMonitor('your-api-key', 'live-chat-id');
monitor.startMonitoring();
```

### Chat Moderation

```typescript
import { YouTubeClient } from '@zbimson/youtube-sdk';

class ChatModerator {
  private client: YouTubeClient;

  constructor(apiKey: string) {
    this.client = new YouTubeClient({ apiKey });
  }

  async moderateMessage(messageId: string, action: 'approve' | 'reject') {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    await this.client.createLiveChatMessagesTransitionApi({
      params: { id: messageId, status }
    });
  }

  async deleteSpamMessage(messageId: string) {
    await this.client.deleteLiveChatMessagesIdApi({
      params: { id: messageId }
    });
  }
}
```

### Super Chat Handling

```typescript
import { YouTubeClient, LiveChatMessage } from '@zbimson/youtube-sdk';

function handleSuperChat(message: LiveChatMessage) {
  if (message.snippet.type === 'superChatEvent') {
    const superChat = message.snippet.superChatDetails;
    const author = message.authorDetails.displayName;
    const amount = superChat?.amountDisplayString;
    const text = superChat?.userComment;

    console.log(`💰 Super Chat from ${author}: ${amount} - ${text}`);
    
    // Handle super chat logic here
    handleHighValueDonation(author, amount, text);
  }
}

function handleHighValueDonation(author: string, amount: string, message: string) {
  // Your super chat handling logic
  console.log(`Processing high value donation from ${author}`);
}
```

## Error Handling

The SDK includes comprehensive error types:

```typescript
import { YouTubeClient } from '@zbimson/youtube-sdk';

try {
  const messages = await youtube.getLiveChatMessagesApi({
    params: {
      liveChatId: 'invalid-id',
      part: 'snippet'
    }
  });
} catch (error) {
  if (error.status === 404) {
    console.error('Live chat not found');
  } else if (error.status === 403) {
    console.error('Access forbidden - check your API key and permissions');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Environment Support

This SDK works in multiple environments:

- **Node.js** (18+)
- **Browsers** (modern browsers with ES2022 support)
- **Cloudflare Workers**
- **Deno** (with npm: specifier)

## Authentication

### API Key Authentication

```typescript
const youtube = new YouTubeClient({
  apiKey: process.env.YOUTUBE_API_KEY
});
```

### OAuth2 Authentication

For operations requiring user authentication, you'll need to extend the base client:

```typescript
import { SdkClientBase } from '@zbimson/youtube-sdk';

class AuthenticatedYouTubeClient extends SdkClientBase {
  constructor(accessToken: string) {
    super({
      baseUrl: 'https://www.googleapis.com/youtube/v3',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
```

## Contributing

This package is auto-generated from the OpenAPI specification. To contribute:

1. Fork the repository
2. Make changes to the OpenAPI spec in `.skmtc/openapi.yaml`
3. Submit a pull request

The GitHub Actions workflow will automatically regenerate and publish the package.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.