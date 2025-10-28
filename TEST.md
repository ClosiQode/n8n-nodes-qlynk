# Testing Guide

How to test n8n-nodes-qlynk locally before publishing.

## Local Development Setup

### 1. Build the Node

```bash
# In the project directory
npm install
npm run build
```

### 2. Link Locally

```bash
# Link the package globally
npm link

# Navigate to n8n custom directory
cd ~/.n8n/custom

# If custom directory doesn't exist, create it
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom

# Initialize if needed
npm init -y

# Link the node
npm link n8n-nodes-qlynk
```

### 3. Start n8n

```bash
# Start n8n (from any directory)
n8n start

# Or with environment variables for AI tools
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true n8n start
```

The Qlynk node should now appear in your nodes panel!

## Testing Checklist

### Basic Functionality

- [ ] Node appears in nodes panel
- [ ] Node icon displays correctly
- [ ] Credential form works
- [ ] Credential test succeeds with valid API key
- [ ] Credential test fails with invalid API key

### URL Operations

#### Create
- [ ] Create link with only URL
- [ ] Create link with custom code
- [ ] Create link with title and description
- [ ] Create link with category
- [ ] Error handling for invalid URL
- [ ] Error handling for duplicate custom code

#### Get
- [ ] Get existing link by code
- [ ] Error handling for non-existent code
- [ ] Error handling for unauthorized access

#### List
- [ ] List all links
- [ ] Returns correct data structure
- [ ] Shows total count

#### Update
- [ ] Update URL
- [ ] Update title and description
- [ ] Update category
- [ ] Error handling for invalid code

#### Delete
- [ ] Delete existing link
- [ ] Error handling for non-existent code

### Category Operations

#### Create
- [ ] Create category with name only
- [ ] Create category with color
- [ ] Create category with icon
- [ ] Error handling for invalid data

#### Get
- [ ] Get existing category
- [ ] Error handling for non-existent ID

#### List
- [ ] List all categories
- [ ] Shows link count per category

#### Update
- [ ] Update name
- [ ] Update color
- [ ] Update icon

#### Delete
- [ ] Delete category
- [ ] Error handling for category with links

### Stats Operations

- [ ] Get stats for link (day)
- [ ] Get stats for link (week)
- [ ] Get stats for link (month)
- [ ] Get stats for link (year)
- [ ] Get stats for link (all)
- [ ] Error handling for invalid code

### AI Agent Integration

- [ ] Node appears in AI tools list
- [ ] AI can create links
- [ ] AI can get link details
- [ ] AI can get statistics
- [ ] AI receives proper error messages

### Error Handling

- [ ] Invalid credentials
- [ ] Network errors
- [ ] Rate limiting
- [ ] Invalid parameters
- [ ] Continue on fail works

### Edge Cases

- [ ] Empty string parameters
- [ ] Very long URLs
- [ ] Special characters in custom code
- [ ] Unicode in titles
- [ ] Null/undefined values

## Manual Test Workflows

### Workflow 1: Basic Link Creation

```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.manualTrigger",
      "name": "Start"
    },
    {
      "type": "n8n-nodes-qlynk.qlynk",
      "name": "Create Link",
      "parameters": {
        "resource": "url",
        "operation": "create",
        "url": "https://n8n.io/docs",
        "custom_code": "n8n-docs",
        "title": "n8n Documentation"
      }
    }
  ]
}
```

**Expected Result:**
```json
{
  "short_code": "n8n-docs",
  "short_url": "https://qlynk.fr/n8n-docs",
  "original_url": "https://n8n.io/docs",
  "title": "n8n Documentation"
}
```

### Workflow 2: Create and Get Stats

```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.manualTrigger",
      "name": "Start"
    },
    {
      "type": "n8n-nodes-qlynk.qlynk",
      "name": "Create Link",
      "parameters": {
        "resource": "url",
        "operation": "create",
        "url": "https://github.com"
      }
    },
    {
      "type": "n8n-nodes-qlynk.qlynk",
      "name": "Get Stats",
      "parameters": {
        "resource": "stats",
        "operation": "get",
        "short_code": "={{$json.short_code}}",
        "period": "all"
      }
    }
  ]
}
```

### Workflow 3: AI Agent Test

```json
{
  "nodes": [
    {
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "name": "Chat Trigger"
    },
    {
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "name": "OpenAI"
    },
    {
      "type": "n8n-nodes-qlynk.qlynk",
      "name": "Qlynk Tool"
    },
    {
      "type": "@n8n/n8n-nodes-langchain.agent",
      "name": "AI Agent"
    }
  ]
}
```

**Test Prompts:**
- "Create a short link for https://example.com"
- "Show me statistics for link abc123"
- "Create a link and tell me its URL"

## Automated Testing (Future)

### Unit Tests Setup

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest

# Create test file
touch nodes/Qlynk/Qlynk.node.test.ts
```

### Example Test

```typescript
import { Qlynk } from './Qlynk.node';

describe('Qlynk Node', () => {
  it('should have correct displayName', () => {
    const node = new Qlynk();
    expect(node.description.displayName).toBe('Qlynk');
  });

  it('should have usableAsTool enabled', () => {
    const node = new Qlynk();
    expect(node.description.usableAsTool).toBe(true);
  });
});
```

## Performance Testing

### Load Test

Create a workflow that:
1. Creates 100 links
2. Retrieves them all
3. Gets stats for each
4. Measure execution time

**Expected Performance:**
- Single create: < 500ms
- Single get: < 300ms
- List 100 links: < 1s
- Get stats: < 500ms

## Debugging Tips

### Enable n8n Debug Mode

```bash
# Start n8n with debug logging
N8N_LOG_LEVEL=debug n8n start
```

### Common Issues

**Node doesn't appear:**
```bash
# Unlink and relink
npm unlink n8n-nodes-qlynk
npm link
cd ~/.n8n/custom
npm link n8n-nodes-qlynk
# Restart n8n
```

**Credentials don't work:**
- Check API URL (no trailing slash)
- Verify API key is correct
- Test API key with curl first

**Build errors:**
```bash
# Clean rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Testing Checklist Summary

Before publishing:

- [ ] All operations work in n8n
- [ ] Error messages are helpful
- [ ] Credentials are validated
- [ ] Icon displays correctly
- [ ] AI tool integration works
- [ ] Documentation is accurate
- [ ] Examples work as described
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Linting passes

## Reporting Issues

Found a bug during testing?

1. Note the exact steps to reproduce
2. Capture error messages
3. Check n8n logs
4. Open an issue on GitHub with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - n8n version
   - Node version
   - Screenshots/logs

---

Happy testing! 🧪
