import { describe, test, expect } from 'vitest';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import path from 'path';
import { YouTubeClient } from '../src/YouTubeClient.generated.js';

// Load and parse OpenAPI spec
const openApiSpec = load(readFileSync(path.join(__dirname, '../.skmtc/openapi.yaml'), 'utf8')) as any;

describe('OpenAPI Spec Validation', () => {
  test('should have all operations from OpenAPI spec implemented in SDK', () => {
    const paths = openApiSpec.paths;
    const expectedOperations: string[] = [];
    
    // Extract all operation IDs from the OpenAPI spec
    Object.entries(paths).forEach(([pathKey, pathValue]: [string, any]) => {
      Object.entries(pathValue).forEach(([method, operation]: [string, any]) => {
        if (operation.operationId) {
          expectedOperations.push(operation.operationId);
        }
      });
    });

    // Check that all expected operations exist in the generated client
    const clientPrototype = YouTubeClient.prototype;
    const clientMethods = Object.getOwnPropertyNames(clientPrototype)
      .filter(name => name !== 'constructor' && typeof clientPrototype[name] === 'function');

    // Map OpenAPI operationIds to expected method names
    const operationToMethodMap: Record<string, string> = {
      'youtube.liveChatMessages.list': 'getYoutubeV3LiveChatMessagesApi',
      'youtube.liveChatMessages.insert': 'createYoutubeV3LiveChatMessagesApi',
      'youtube.liveChatMessages.delete': 'deleteYoutubeV3LiveChatMessagesApi',
    };

    expectedOperations.forEach(operationId => {
      const expectedMethodName = operationToMethodMap[operationId];
      if (expectedMethodName) {
        expect(clientMethods).toContain(expectedMethodName);
      }
    });
  });

  test('should have correct method signatures for getYoutubeV3LiveChatMessagesApi', () => {
    const client = new YouTubeClient(
      { access_token: 'test', refresh_token: 'test', expires_at: Date.now(), scope: 'test', token_type: 'Bearer' },
      'test',
      'test'
    );

    // Check that method exists and is a function
    expect(typeof client.getYoutubeV3LiveChatMessagesApi).toBe('function');
    expect(client.getYoutubeV3LiveChatMessagesApi.length).toBe(1); // Should accept 1 parameter (args object)
  });

  test('should have correct method signatures for createYoutubeV3LiveChatMessagesApi', () => {
    const client = new YouTubeClient(
      { access_token: 'test', refresh_token: 'test', expires_at: Date.now(), scope: 'test', token_type: 'Bearer' },
      'test',
      'test'
    );

    expect(typeof client.createYoutubeV3LiveChatMessagesApi).toBe('function');
    expect(client.createYoutubeV3LiveChatMessagesApi.length).toBe(1);
  });

  test('should have correct method signatures for deleteYoutubeV3LiveChatMessagesApi', () => {
    const client = new YouTubeClient(
      { access_token: 'test', refresh_token: 'test', expires_at: Date.now(), scope: 'test', token_type: 'Bearer' },
      'test',
      'test'
    );

    expect(typeof client.deleteYoutubeV3LiveChatMessagesApi).toBe('function');
    expect(client.deleteYoutubeV3LiveChatMessagesApi.length).toBe(1);
  });

  test('should validate OpenAPI spec structure', () => {
    expect(openApiSpec).toBeDefined();
    expect(openApiSpec.openapi).toBe('3.0.0');
    expect(openApiSpec.info.title).toBe('YouTube Data API v3');
    expect(openApiSpec.paths).toBeDefined();
    expect(openApiSpec.components.schemas).toBeDefined();
  });

  test('should have all required schemas defined', () => {
    const requiredSchemas = [
      'LiveChatMessage',
      'LiveChatMessageSnippet',
      'LiveChatMessageAuthorDetails',
      'LiveChatTextMessageDetails',
      'LiveChatMessageListResponse'
    ];

    const definedSchemas = Object.keys(openApiSpec.components.schemas);
    
    requiredSchemas.forEach(schema => {
      expect(definedSchemas).toContain(schema);
    });
  });

  test('should have all expected paths defined', () => {
    const expectedPaths = [
      '/youtube/v3/liveChat/messages'
    ];

    const definedPaths = Object.keys(openApiSpec.paths);
    
    expectedPaths.forEach(expectedPath => {
      expect(definedPaths).toContain(expectedPath);
    });
  });

  test('should have correct HTTP methods for each path', () => {
    // /youtube/v3/liveChat/messages should have GET, POST, and DELETE
    expect(openApiSpec.paths['/youtube/v3/liveChat/messages'].get).toBeDefined();
    expect(openApiSpec.paths['/youtube/v3/liveChat/messages'].post).toBeDefined();
    expect(openApiSpec.paths['/youtube/v3/liveChat/messages'].delete).toBeDefined();
  });
});