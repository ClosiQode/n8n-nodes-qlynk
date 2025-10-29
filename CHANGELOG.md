# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-29

### 🚀 Major Update: Specialized Nodes Architecture

Cette version révolutionne l'architecture du package avec **11 nodes spécialisés** remplaçant le node monolithique. Chaque opération API a maintenant son propre node, et **tous les nodes fonctionnent à la fois comme nodes workflow classiques ET comme tools IA**.

### Added

#### 11 Specialized Nodes (Dual-Mode: Workflow + AI Tool)

**URL Management Nodes (5)**
- **Qlynk URL Create** - Create new short links
- **Qlynk URL Get** - Retrieve link by short code
- **Qlynk URL List** - List all your short links
- **Qlynk URL Update** - Update existing links
- **Qlynk URL Delete** - Delete links

**Category Management Nodes (5)**
- **Qlynk Category Create** - Create new categories
- **Qlynk Category Get** - Retrieve category by ID
- **Qlynk Category List** - List all categories
- **Qlynk Category Update** - Update category properties
- **Qlynk Category Delete** - Delete categories

**Statistics Node (1)**
- **Qlynk Stats** - Get link statistics with period selection

#### AI Agent Integration (LangChain)

Chaque node implémente **deux méthodes** pour fonctionner dans les deux modes :
- `execute()` - Pour utilisation dans workflows classiques
- `supplyData()` - Pour utilisation comme tool IA (LangChain DynamicTool)

**Caractéristiques AI Tools :**
- Conversion automatique entrée/sortie JSON ↔ String
- Descriptions détaillées pour les LLMs
- Parsing intelligent des paramètres
- Gestion d'erreurs optimisée pour les agents

#### Infrastructure Changes

**Nouveau système de helpers partagés** (`nodes/utils/`)
- `helpers.ts` - Fonctions communes (API requests, formatting, parsing)
- `types.ts` - Types TypeScript partagés

**Dépendances**
- Ajout de `@langchain/core` pour le support LangChain
- Module system upgradé à Node16 pour compatibilité

**Architecture modulaire**
- Chaque node dans son propre dossier
- Logo Qlynk copié dans chaque dossier de node
- Outputs dual-mode : `['main', 'ai_tool']`
- Inputs flexibles : `['main']`

### Changed

**Package.json**
- Description mise à jour pour refléter les nodes multiples
- Keywords enrichis : `ai-agent`, `langchain`
- Référencement de tous les 12 nodes (11 nouveaux + 1 legacy)

**TypeScript Configuration**
- `module` : Node16
- `moduleResolution` : node16
- Support imports LangChain

**Node Monolithique (Legacy)**
- Le node `Qlynk` original est **conservé pour compatibilité**
- Toujours fonctionnel pour les workflows existants
- Recommandé de migrer vers les nodes spécialisés

### Technical Implementation

**Dual-Mode Pattern**
```typescript
// Chaque node implémente les deux méthodes :
async supplyData(): Promise<SupplyData> {
  return { response: new DynamicTool(...) };
}

async execute(): Promise<INodeExecutionData[][]> {
  // Workflow logic
}
```

**Helper Architecture**
- `makeQlynkRequest()` - Requêtes API authentifiées
- `formatToolResponse()` - Formatage JSON → String pour LLMs
- `parseToolInput()` - Parsing String/Object → Paramètres

**Node Connection Types**
- Outputs : `NodeConnectionType.Main` + `NodeConnectionType.AiTool`
- N8n décide automatiquement quelle méthode appeler selon le contexte

### Migration Guide

**Pour workflows existants :**
- Aucune action requise - le node `Qlynk` original fonctionne toujours
- Migration optionnelle vers nodes spécialisés pour meilleure granularité

**Pour AI Agents :**
- Activer `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` dans N8n (v1.79+)
- Connecter les nodes spécialisés aux ports `ai_tool` des AI Agents
- Les tools apparaissent automatiquement avec noms : `qlynk_url_create`, `qlynk_category_list`, etc.

### Benefits

✅ **Granularité** - Un node = Une opération API
✅ **AI Native** - Dual-mode intégré dès la conception
✅ **Maintenance** - Code modulaire et helpers partagés
✅ **Performance** - Chargement uniquement des nodes nécessaires
✅ **Expérience** - Descriptions optimisées pour chaque contexte
✅ **Compatibilité** - Node legacy conservé, migration douce

## [1.0.2] - 2025-10-29

### Fixed

#### Authentication avec l'API Qlynk
- **CRITIQUE : Ajout du préfixe "Bearer"** dans le header Authorization
- **Format correct** : `Authorization: Bearer VOTRE_CLE_API`
- **Résolution du problème** : Les credentials se valident maintenant correctement
- **Plus d'erreur "Couldn't connect"** : Le test des credentials fonctionne parfaitement

### Technical Details
L'API Qlynk attend le format `Authorization: Bearer {token}` (voir ApiAuth.php ligne 34).
Le node envoyait uniquement la clé API sans le préfixe "Bearer", causant l'échec de l'authentification.

## [1.0.1] - 2025-10-28

### Fixed

#### Credentials Configuration
- **Removed API URL field from credentials** - L'utilisateur n'a plus besoin de configurer l'URL de l'API
- **URL hardcodée** - L'URL de l'API Qlynk (`https://qlynk.fr/api/v1`) est maintenant hardcodée dans le code
- **Simplification** - L'utilisateur ne configure plus que sa clé API, l'expérience est plus simple

#### API Requests
- **URLs complètes** - Toutes les requêtes API utilisent maintenant des URLs absolues
- **Test des credentials fonctionnel** - Le test de connexion lors de la sauvegarde des credentials fonctionne correctement
- **Élimination des erreurs de retry** - Les problèmes de tentatives de connexion répétées sont résolus

### Changed
- Credentials ne demandent plus que la clé API (l'URL n'est plus configurable)
- Toutes les requêtes utilisent des URLs complètes vers `https://qlynk.fr/api/v1`

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
