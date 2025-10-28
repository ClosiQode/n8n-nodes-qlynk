# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-28

### Added

#### URL Resource
- Create short links with optional custom codes
- Retrieve link details by short code
- List all user's short links
- Update existing short links
- Delete short links
- Support for title, description, indexing control
- Category assignment for links

#### Category Resource
- Create categories with custom colors and icons
- Retrieve category details by ID
- List all user's categories
- Update category properties
- Delete categories
- Color customization (hex codes)
- Font Awesome icon support

#### Stats Resource
- Get link statistics by short code
- Multiple time periods: day, week, month, year, all-time
- Detailed analytics data

#### AI Agent Support
- Node marked with `usableAsTool: true`
- Compatible with n8n AI Agent workflows
- Can be used by AI to automatically create and manage links
- Supports community package tool usage

#### Infrastructure
- TypeScript implementation
- Full n8n workflow integration
- Credential management with API key authentication
- Automatic credential testing
- Error handling with continueOnFail support
- Comprehensive documentation

### Technical Details
- Built with n8n-workflow 1.52.0
- TypeScript 5.5.3
- Supports n8n API version 1
- MIT licensed

## [Unreleased]

### Planned Features
- QR code generation for links
- Bulk operations support
- Advanced filtering for list operations
- Webhook support for link events
- Link expiration management
