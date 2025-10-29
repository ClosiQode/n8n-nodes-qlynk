# n8n-nodes-qlynk

![Qlynk Logo](https://qlynk.fr/assets/logo.png)

This is an n8n community node that lets you interact with the [Qlynk](https://qlynk.fr) URL shortener API directly from your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Qlynk](https://qlynk.fr) is a powerful URL shortener with advanced statistics, deep links, and rich metadata.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
  - [As a Regular Node](#as-a-regular-node)
  - [As an AI Tool](#as-an-ai-tool)
- [Resources](#resources)
- [Version history](#version-history)
- [Development](#development)
- [Publishing to npm](#publishing-to-npm)
- [License](#license)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Using npm

```bash
npm install n8n-nodes-qlynk
```

### Using n8n interface

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-qlynk` in **Enter npm package name**
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

After installation, restart n8n for the node to appear in the nodes panel.

## Prerequisites

You need:

1. An active [Qlynk](https://qlynk.fr) account
2. A Qlynk API key (generate one from your dashboard under Profile > API Keys)
3. [n8n](https://n8n.io/) installed (version 0.240.0 or later)

## Operations

The Qlynk node supports three main resources:

### URL Resource

Manage short links:

- **Create**: Create a new short link
  - Required: Original URL
  - Optional: Custom code, title, description, is_indexed, category_id

- **Get**: Retrieve details of a specific short link
  - Required: Short code

- **List**: List all your short links

- **Update**: Update an existing short link
  - Required: Short code
  - Optional: URL, title, description, is_indexed, category_id

- **Delete**: Delete a short link
  - Required: Short code

### Category Resource

Organize links into categories:

- **Create**: Create a new category
  - Required: Name
  - Optional: Color (hex), icon (Font Awesome name)

- **Get**: Retrieve details of a specific category
  - Required: Category ID

- **List**: List all your categories

- **Update**: Update an existing category
  - Required: Category ID, name
  - Optional: Color, icon

- **Delete**: Delete a category
  - Required: Category ID

### Stats Resource

Track link performance:

- **Get**: Get statistics for a short link
  - Required: Short code
  - Optional: Period (day, week, month, year, all)

## Credentials

This node requires Qlynk API credentials. To set them up:

1. Go to your [Qlynk dashboard](https://qlynk.fr/dashboard)
2. Navigate to **Profile** > **API Keys**
3. Click **Generate New Key**
4. Copy the generated API key
5. In n8n, create new Qlynk API credentials:
   - **API URL**: `https://qlynk.fr` (or your self-hosted instance URL)
   - **API Key**: Paste your API key

The credentials will be automatically tested when you save them.

## Compatibility

- **Minimum n8n version**: 0.240.0
- **Tested with n8n version**: 1.52.0
- **Minimum Qlynk API version**: v1

## Usage

### As a Regular Node

1. Add the Qlynk node to your workflow
2. Select the **Resource** (URL, Category, or Stats)
3. Select the **Operation** you want to perform
4. Configure the required and optional parameters
5. Connect your Qlynk API credentials
6. Execute the workflow

#### Example: Create a Short Link

```json
{
  "resource": "url",
  "operation": "create",
  "url": "https://example.com/my-very-long-url",
  "custom_code": "my-link",
  "title": "My Example Link",
  "description": "This is an example short link",
  "is_indexed": true,
  "category_id": 1
}
```

Response:
```json
{
  "short_code": "my-link",
  "short_url": "https://qlynk.fr/my-link",
  "original_url": "https://example.com/my-very-long-url",
  "title": "My Example Link",
  "description": "This is an example short link",
  "is_indexed": 1,
  "category_id": 1,
  "created_at": "2025-10-28 10:30:00"
}
```

### As an AI Tool

The Qlynk node can be used as a tool by AI agents in n8n!

#### Prerequisites for AI Tool Usage

**All Qlynk nodes are AI-ready!** To use community nodes as AI tools, you need to enable the following environment variable in your n8n instance:

```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

**Docker Configuration:**

If you're running n8n in Docker, add this to your `docker-compose.yml`:

```yaml
environment:
  - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

Or use it when running Docker:

```bash
docker run -it --rm \
  -e N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**After setting the environment variable, restart your n8n instance.**

#### Setup

1. Add an **AI Agent** node to your workflow
2. Connect the Qlynk node to the AI Agent's **Tools** input
3. Configure the AI Agent with a language model (OpenAI, Anthropic, etc.)
4. The AI can now automatically use Qlynk to:
   - Create short links when needed
   - Retrieve link information
   - Get statistics
   - Manage categories

#### Example AI Agent Prompt

```
Create a short link for https://docs.example.com/api and
give me the statistics for the last week.
```

The AI agent will:
1. Use the Qlynk node to create the short link
2. Use the Qlynk node to fetch statistics
3. Return a formatted response with the information

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Qlynk API documentation](https://qlynk.fr/docs/api)
- [Qlynk website](https://qlynk.fr)
- [GitHub repository](https://github.com/ClosiQode/n8n-nodes-qlynk)

## Version history

### 1.2.3 (2025-10-29)

**REAL FIX: AI Tool execution with zero input items!**

**THE ACTUAL ROOT CAUSE:** When nodes are used as AI Agent tools, they receive **ZERO input items** (`items.length === 0`), causing the `for` loop to never execute!

**What was wrong:**
```typescript
for (let i = 0; i < items.length; i++) {  // Never loops when items.length is 0!
```

**Fixed with:**
```typescript
// When used as AI tool, items.length is 0 but we still need to execute once
const length = Math.max(items.length, 1);
for (let i = 0; i < length; i++) {  // Executes at least once!
```

**Impact:**
- ✅ **Tools now execute properly when called by AI Agent**
- ✅ Works for both regular workflow usage AND AI tool usage
- ✅ All 11 nodes fixed

### 1.2.2 (2025-10-29)

**CRITICAL FIX: First execution failure resolved!**

This version fixes the issue where AI Agent tools appeared in logs but didn't execute on first run (required retry to work).

**Root cause identified:**
- Native n8n nodes use `this.prepareOutputData()` helper method
- Community nodes need this for proper virtual tool wrapper initialization
- Without it, lazy loading causes first execution to fail silently

**What changed:**
- All nodes now use `this.prepareOutputData(returnData)` instead of `this.helpers.returnJsonArray()`
- Changed return data type from `any[]` to `INodeExecutionData[]`
- Data wrapped properly: `returnData.push({ json: responseData })`

**Impact:**
- ✅ **Tools execute correctly on FIRST attempt** (no more retry needed)
- ✅ Matches native node pattern exactly
- ✅ Proper initialization with virtual tool wrapper

**Technical details:**
```typescript
// Before (v1.2.1 - required retry):
const returnData: any[] = [];
returnData.push(responseData);
return [this.helpers.returnJsonArray(returnData)];

// After (v1.2.2 - works first time):
const returnData: INodeExecutionData[] = [];
returnData.push({ json: responseData });
return this.prepareOutputData(returnData);
```

### 1.2.1 (2025-10-29)

**ATTEMPTED FIX: AI Agent tool response handling** (This didn't solve the root issue)
- Changed all nodes to use `this.helpers.returnJsonArray()` instead of direct array return
- Simplified data structure: removed `{json, pairedItem}` wrapper
- This was based on comparing with native nodes but missed the key `prepareOutputData()` method

### 1.2.0 (2025-10-29)

**Major AI Agent compatibility improvements:**
- Fixed AI Agent tool execution issues by removing `required: true` flags
- Added manual parameter validation with clear error messages
- Improved tool descriptions for better AI understanding
- Enhanced parameter descriptions with explicit REQUIRED/OPTIONAL markers
- Updated logo images with higher quality versions

This version solves the common issue where AI Agents would identify the tool but fail to execute it due to optional parameter schema conflicts.

### 1.1.9 (2025-10-29)

- Updated node icons with improved logo images

### 1.1.8 (2025-10-29)

- Enabled AI Tool support with `usableAsTool: true`
- Added comprehensive AI Agent documentation

### 1.1.7 (2025-10-29)

**CRITICAL FIX:**
- Renamed all nodes to fix installation error (SQLITE_CONSTRAINT)
- Changed from prefix-heavy naming (qlynkUrlCreate) to varied names (createUrl)

### 1.1.6 (2025-10-29)

- Changed TypeScript module system from Node16 to commonjs for compatibility

### 1.0.0 (2025-10-28)

Initial release with support for:
- URL operations (create, get, list, update, delete)
- Category operations (create, get, list, update, delete)
- Stats operations (get)
- AI agent compatibility with `usableAsTool: true`

## Development

To develop and test this node locally:

### Setup

```bash
# Clone the repository
git clone https://github.com/ClosiQode/n8n-nodes-qlynk.git
cd n8n-nodes-qlynk

# Install dependencies
npm install

# Build the node
npm run build
```

### Local Testing

```bash
# Link the node locally
npm link

# In your n8n installation directory
cd ~/.n8n/custom
npm init -y
npm link n8n-nodes-qlynk

# Start n8n
n8n start
```

### Development Mode

```bash
# Watch for changes and rebuild automatically
npm run dev
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lintfix
```

## Publishing to npm

### Initial Setup

1. Create an npm account at [npmjs.com](https://www.npmjs.com/)
2. Login via CLI:
   ```bash
   npm login
   ```

### Publishing Steps

```bash
# 1. Ensure all tests pass
npm run build
npm run lint

# 2. Update version in package.json (follow semver)
npm version patch  # or minor, or major

# 3. Publish to npm
npm publish

# 4. Push tags to GitHub
git push --follow-tags
```

### Publishing Checklist

- [ ] All code is tested and working
- [ ] README is up to date
- [ ] Version number updated in package.json
- [ ] CHANGELOG updated with changes
- [ ] Git committed and pushed
- [ ] npm publish executed successfully
- [ ] Package appears on npmjs.com
- [ ] Test installation: `npm install n8n-nodes-qlynk`

### Updating Existing Package

```bash
# 1. Make your changes
# 2. Update version
npm version patch  # increment version

# 3. Build and publish
npm run build
npm publish

# 4. Push to GitHub
git push --follow-tags
```

## License

[MIT](LICENSE.md)

## Support

For issues, questions, or contributions:

- Open an issue on [GitHub](https://github.com/ClosiQode/n8n-nodes-qlynk/issues)
- Contact: contact@qlynk.fr
- Qlynk documentation: https://qlynk.fr/docs

---

Made with ❤️ by [ClosiQode](https://github.com/ClosiQode)
