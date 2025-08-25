# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of YouTube SDK
- Generated from OpenAPI specification using SKMTC CLI
- Full TypeScript support with comprehensive type definitions
- Live Chat API support including:
  - Get live chat messages
  - Send live chat messages  
  - Delete live chat messages
  - Moderate live chat messages (approve/reject)
- Support for all live chat message types:
  - Text messages
  - Super Chat
  - Super Stickers
  - Member milestone chats
  - New sponsor notifications
  - Membership gifting
  - User bans
  - Message deletions and retractions
  - Polls
- Universal compatibility (Node.js, browsers, Cloudflare Workers, Deno)
- GitHub Actions automation for code generation and publishing
- Comprehensive documentation and usage examples

### Technical Details
- Generated from SKMTC CLI version 0.0.153
- TypeScript 5.0+ support
- ES2022 target with CommonJS and ESM builds
- Tree-shakeable exports
- Source maps and declaration files included

## [1.0.0] - TBD

### Added
- Initial stable release