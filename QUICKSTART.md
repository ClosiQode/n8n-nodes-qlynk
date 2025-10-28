# Quick Start Guide

Get up and running with n8n-nodes-qlynk in 5 minutes!

## Prerequisites

- [ ] n8n installed (v0.240.0+)
- [ ] Qlynk account at [qlynk.fr](https://qlynk.fr)
- [ ] Qlynk API key

## Step 1: Get Your API Key

1. Log in to [Qlynk](https://qlynk.fr)
2. Go to **Dashboard** → **Profile** → **API Keys**
3. Click **Generate New Key**
4. Copy the API key (you won't see it again!)

## Step 2: Install the Node

### Option A: Via n8n Interface (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter: `n8n-nodes-qlynk`
5. Click **Install**
6. Restart n8n

### Option B: Via npm

```bash
# In your n8n directory
npm install n8n-nodes-qlynk

# Restart n8n
n8n start
```

## Step 3: Configure Credentials

1. In n8n, create a new workflow
2. Add a Qlynk node
3. Click on **Credentials** → **Create New**
4. Fill in:
   - **API URL**: `https://qlynk.fr`
   - **API Key**: Your copied API key
5. Click **Save** (it will test the connection)

## Step 4: Create Your First Short Link

### Simple Workflow

1. Add a **Manual Trigger** node
2. Add a **Qlynk** node
3. Configure:
   - **Resource**: URL
   - **Operation**: Create
   - **Original URL**: `https://example.com/your-long-url`
   - **Custom Code**: `my-first-link` (optional)
4. Connect the nodes
5. Click **Execute Workflow**

### Result

You'll get a response like:

```json
{
  "short_code": "my-first-link",
  "short_url": "https://qlynk.fr/my-first-link",
  "original_url": "https://example.com/your-long-url",
  "created_at": "2025-10-28 10:30:00"
}
```

## Step 5: Get Statistics

1. Add another **Qlynk** node
2. Configure:
   - **Resource**: Stats
   - **Operation**: Get
   - **Short Code**: `={{$json.short_code}}`
   - **Period**: Week
3. Connect it after the Create node
4. Execute the workflow

## Common Use Cases

### 1. Auto-Shorten URLs from RSS Feed

```
RSS Feed → Qlynk (Create) → Send to Slack
```

### 2. Track Campaign Links

```
HTTP Request (Get Campaign URLs) → Qlynk (Create with Category) → Save to Database
```

### 3. QR Code Generator

```
Manual Trigger → Qlynk (Create) → QR Code Generator → Email
```

### 4. AI-Powered Link Manager

```
Chat Trigger → AI Agent (with Qlynk Tool) → Response
```

Example prompt: *"Create a short link for https://docs.example.com and get its statistics"*

## Troubleshooting

### Node doesn't appear after installation

1. Restart n8n completely
2. Clear browser cache
3. Check n8n logs for errors

### Credential test fails

1. Verify your API key is correct
2. Check API URL (should be `https://qlynk.fr`)
3. Ensure your Qlynk account is active

### "Community packages not allowed" error (AI Tools)

Add to your environment:
```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## Next Steps

- [ ] Explore [example workflows](./examples/)
- [ ] Read the full [README](./README.md)
- [ ] Check [Qlynk API docs](https://qlynk.fr/docs/api)
- [ ] Join the [n8n community](https://community.n8n.io/)

## Support

Need help?
- 📧 Email: contact@qlynk.fr
- 🐛 Issues: [GitHub](https://github.com/ClosiQode/n8n-nodes-qlynk/issues)
- 📚 Docs: [qlynk.fr/docs](https://qlynk.fr/docs)

Happy automating! 🚀
