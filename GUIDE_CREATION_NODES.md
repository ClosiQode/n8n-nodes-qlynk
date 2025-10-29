# Guide de création de nodes n8n community

Ce guide documente les bonnes pratiques et pièges à éviter lors de la création de community nodes pour n8n, basé sur notre expérience avec le package n8n-nodes-qlynk.

## Table des matières

- [Problèmes rencontrés et solutions](#problèmes-rencontrés-et-solutions)
- [Structure du projet](#structure-du-projet)
- [Configuration TypeScript](#configuration-typescript)
- [Naming conventions](#naming-conventions)
- [AI Tools configuration](#ai-tools-configuration)
- [Checklist avant publication](#checklist-avant-publication)

## Problèmes rencontrés et solutions

### 1. ❌ ERREUR CRITIQUE : Nom de nodes avec préfixe répétitif

**Symptôme :**
```
Error installing new package
There is already an entry with this name
SQLITE_CONSTRAINT: UNIQUE constraint failed: installed_nodes.name
```

**Cause :**
Tous les nodes commençaient par le même préfixe (`qlynkUrlCreate`, `qlynkUrlGet`, `qlynkUrlList`, etc.), ce qui causait un conflit lors de l'enregistrement dans la base SQLite de n8n.

**❌ Mauvais :**
```typescript
// Node 1
name: 'qlynkUrlCreate'

// Node 2
name: 'qlynkUrlGet'

// Node 3
name: 'qlynkUrlList'
// Tous commencent par "qlynk" → PROBLÈME !
```

**✅ Bon :**
```typescript
// Node 1
name: 'createUrl'

// Node 2
name: 'getUrl'

// Node 3
name: 'listUrls'
// Noms variés et distincts → OK !
```

**Solution :**
- Utiliser des **noms de nodes VARIÉS** et **DISTINCTS**
- Éviter les préfixes répétitifs identiques
- S'inspirer des packages existants comme `@custom-js/n8n-nodes-pdf-toolkit` qui utilise des noms comme `scraper`, `sslChecker`, `html2Pdf`, etc.

### 2. ❌ Module TypeScript inadapté

**Problème :**
Utilisation de `"module": "Node16"` dans `tsconfig.json` causait des problèmes de chargement des nodes.

**❌ Mauvais :**
```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "node16"
  }
}
```

**✅ Bon :**
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

**Solution :**
Toujours utiliser `commonjs` pour la compatibilité maximale avec n8n.

### 3. ⚠️ Naming convention des fichiers

**Règle stricte :**
Le nom du fichier, du dossier, de la classe et du node name doivent tous correspondre.

**✅ Structure correcte :**
```
nodes/
  CreateUrl/
    CreateUrl.node.ts    ← Nom de fichier correspond
      export class CreateUrl {
        description = {
          name: 'createUrl'  ← Nom du node (camelCase)
        }
      }
```

**Convention :**
- **Dossier** : PascalCase (exemple : `CreateUrl/`)
- **Fichier** : PascalCase (exemple : `CreateUrl.node.ts`)
- **Classe** : PascalCase (exemple : `class CreateUrl`)
- **Node name** : camelCase (exemple : `name: 'createUrl'`)

### 4. 🤖 Configuration AI Tools

**Pour rendre un node utilisable par les AI Agents :**

**❌ Ne PAS oublier :**
```typescript
export class CreateUrl implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Qlynk - Create URL',
    name: 'createUrl',
    usableAsTool: true,  // ← ESSENTIEL pour AI Tools !
    // ...
  };
}
```

**Configuration utilisateur requise :**
L'utilisateur DOIT configurer la variable d'environnement :
```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

**Documentation à inclure dans le README :**
```markdown
### As an AI Tool

**All [YourPackage] nodes are AI-ready!** To use community nodes as AI tools, enable:

```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

**Docker Configuration:**
```yaml
environment:
  - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```
```

## Structure du projet

### Architecture recommandée

```
n8n-nodes-qlynk/
├── nodes/                          # Un dossier par node
│   ├── CreateUrl/
│   │   ├── CreateUrl.node.ts      # Fichier principal du node
│   │   └── qlynk.png              # Icône du node
│   ├── GetUrl/
│   │   ├── GetUrl.node.ts
│   │   └── qlynk.png
│   └── utils/                      # Helpers partagés
│       ├── helpers.ts
│       └── types.ts
├── credentials/
│   └── QlynkApi.credentials.ts    # Credentials partagées
├── dist/                           # Fichiers compilés (gitignore)
├── package.json
├── tsconfig.json
├── gulpfile.js                     # Build des icônes
├── .eslintrc.js
└── README.md
```

### Package.json structure

```json
{
  "name": "n8n-nodes-yourpackage",
  "version": "1.0.0",
  "description": "n8n nodes for ...",
  "keywords": [
    "n8n-community-node-package",  // ← REQUIS !
    "n8n",
    "your-keywords"
  ],
  "license": "MIT",
  "main": "index.js",
  "files": [
    "dist"  // ← Seulement le dossier dist !
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/YourApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/CreateResource/CreateResource.node.js",
      "dist/nodes/GetResource/GetResource.node.js"
      // ... Un path par node
    ]
  },
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "lint": "eslint nodes credentials",
    "lintfix": "eslint nodes credentials --fix",
    "format": "prettier nodes credentials --write",
    "prepublishOnly": "npm run build && npm run lint"
  },
  "devDependencies": {
    "@types/node": "^18.16.0",
    "eslint": "^8.56.0",
    "eslint-plugin-n8n-nodes-base": "^1.16.1",
    "gulp": "^4.0.2",
    "n8n-workflow": "^1.52.0",
    "prettier": "^3.3.2",
    "typescript": "^5.5.3"
  },
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
```

## Configuration TypeScript

### tsconfig.json recommandé

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",           // ← IMPORTANT : pas Node16 !
    "lib": ["ES2019"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./",
    "removeComments": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",     // ← IMPORTANT : pas node16 !
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": [
    "credentials/**/*",
    "nodes/**/*"
  ],
  "exclude": [
    "node_modules/**/*",
    "dist/**/*"
  ]
}
```

## Naming conventions

### Stratégie de nommage pour multiples nodes

**Principe :** Chaque node doit avoir un nom **UNIQUE** et **VARIÉ**

#### ✅ Bonne approche : Action-first naming

```typescript
// URLs
createUrl      ← Action claire
getUrl
listUrls       ← Pluriel si liste
updateUrl
deleteUrl

// Categories
createCategory
getCategory
listCategories
updateCategory
deleteCategory

// Stats/Analytics
statistics     ← Nom distinct
```

#### ❌ Mauvaise approche : Prefix-heavy naming

```typescript
// À ÉVITER !
qlynkUrlCreate    ← Tous commencent par "qlynk"
qlynkUrlGet
qlynkUrlList
qlynkUrlUpdate
qlynkUrlDelete
```

### DisplayName vs Name

```typescript
description: INodeTypeDescription = {
  displayName: 'Qlynk - Create URL',  // ← Affiché dans l'UI (peut inclure marque)
  name: 'createUrl',                   // ← ID technique (doit être unique)
  defaults: {
    name: 'Create URL',                // ← Nom par défaut du node dans le workflow
  }
}
```

## AI Tools configuration

### Template de node AI-ready

```typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class CreateResource implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'YourService - Create Resource',
    name: 'createResource',
    icon: 'file:yourlogo.png',
    group: ['transform'],
    version: 1,
    usableAsTool: true,  // ← Pour AI Agent support
    description: 'Use this tool to create a new resource. Provide the required parameters and get back the created resource details.',
    defaults: {
      name: 'Create Resource',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'yourServiceApi',
        required: true,
      },
    ],
    properties: [
      // ... vos paramètres
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const credentials = await this.getCredentials('yourServiceApi');

      // ... votre logique

      returnData.push({
        json: responseData,
      });
    }

    return [returnData];
  }
}
```

### Description optimisée pour AI

**✅ Bon exemple de description :**
```typescript
description: 'Use this tool to create a new shortened URL with Qlynk. Provide the long URL to shorten, optionally with a custom code, title, description, and category. Returns the complete short link information including the short code and full short URL.'
```

**Caractéristiques :**
- Commence par "Use this tool to..."
- Décrit clairement l'action
- Mentionne les paramètres principaux
- Indique ce qui est retourné

## Checklist avant publication

### Pre-flight checks

- [ ] **Noms de nodes VARIÉS** (pas de préfixe répétitif)
- [ ] **module: "commonjs"** dans tsconfig.json
- [ ] **Tous les fichiers/dossiers/classes correspondent** aux conventions
- [ ] **usableAsTool: true** sur tous les nodes (si AI support souhaité)
- [ ] **README.md mis à jour** avec section AI Tools
- [ ] **index.js présent** à la racine (même si vide)
- [ ] **package.json keywords inclut "n8n-community-node-package"**
- [ ] **Icônes copiées** dans dist/ via gulpfile
- [ ] **npm run build** passe sans erreurs
- [ ] **npm run lint** passe sans erreurs
- [ ] **Version incrémentée** dans package.json

### Build & Test

```bash
# 1. Clean build
rm -rf dist
npm run build

# 2. Lint
npm run lint

# 3. Test local installation
npm link
cd ~/.n8n/custom
npm link n8n-nodes-yourpackage

# 4. Start n8n and test
n8n start
```

### Publication

```bash
# 1. Login npm (première fois)
npm login

# 2. Publish
npm publish

# 3. Git commit & push
git add -A
git commit -m "Version X.X.X - Description"
git push

# 4. Test installation
npm install n8n-nodes-yourpackage
```

## Ressources utiles

### Documentation officielle
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n AI Agent Tools](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)

### Exemples de packages bien structurés
- [@custom-js/n8n-nodes-pdf-toolkit](https://www.npmjs.com/package/@custom-js/n8n-nodes-pdf-toolkit) - 14 nodes
- [n8n-nodes-mcp](https://www.npmjs.com/package/n8n-nodes-mcp) - MCP client avec AI tools

### Outils
- [n8n-nodes-base eslint plugin](https://www.npmjs.com/package/eslint-plugin-n8n-nodes-base)
- [n8n-workflow types](https://www.npmjs.com/package/n8n-workflow)

## Workflow de développement recommandé

### 1. Recherche & Planning
```bash
# Chercher des packages similaires
npm search n8n-nodes [votre-domaine]

# Analyser leur structure
git clone [repo-exemple]
```

### 2. Développement
```bash
# Mode watch
npm run dev

# Test dans n8n local via link
npm link
```

### 3. Validation
```bash
# Build complet
npm run build

# Lint
npm run lint

# Test installation réelle
npm pack
npm install ./n8n-nodes-yourpackage-1.0.0.tgz
```

### 4. Publication
```bash
# Publish sur npm
npm publish

# Tag git
git tag v1.0.0
git push --tags
```

## Troubleshooting

### Erreur "SQLITE_CONSTRAINT: UNIQUE constraint"
→ **Vos noms de nodes ont un préfixe répétitif, changez-les !**

### Erreur "Module not found" après installation
→ Vérifiez que `tsconfig.json` utilise `"module": "commonjs"`

### Nodes n'apparaissent pas dans l'UI
→ Vérifiez `package.json` > `n8n.nodes[]` paths

### AI Agent ne voit pas les tools
→ Utilisateur doit configurer `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`

### Linter errors sur les noms de fichiers
→ Les noms de fichiers doivent correspondre exactement aux class names

---

**Ce guide est basé sur notre expérience réelle lors du développement de n8n-nodes-qlynk.**

Version du guide : 1.0.0 (2025-10-29)
