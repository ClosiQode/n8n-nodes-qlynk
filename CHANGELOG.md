# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.5] - 2025-10-29

### 🧪 Test: Temporarily Disable usableAsTool

**Test pour diagnostiquer le problème d'installation**

### Changed

- **DÉSACTIVATION TEMPORAIRE de `usableAsTool: true`** - Tous les nodes fonctionnent maintenant uniquement comme nodes workflow classiques
- **Test de diagnostic** - Cette version permet de vérifier si le problème `SQLITE_CONSTRAINT` vient de l'interaction entre "multiple nodes" + "usableAsTool"

### Technical Details

**Pourquoi ce test ?**
- v1.0.2 (1 node monolithique) s'installait sans problème
- v1.1.0-1.1.4 (11 nodes spécialisés avec usableAsTool) causent l'erreur `SQLITE_CONSTRAINT: UNIQUE constraint failed: installed_nodes.name`
- GitHub Issue #10699 documente des problèmes avec plusieurs nodes dans le même package
- Cette version teste si `usableAsTool: true` sur 11 nodes cause le conflit

**Si cette version s'installe correctement:**
- Le problème vient bien de l'interaction "multiple nodes + usableAsTool"
- Il faudra trouver une solution alternative pour AI Agent support (peut-être via HTTP Request node ou autre méthode)

**Si cette version échoue aussi:**
- Le problème vient d'autre chose (structure du package, noms de nodes, etc.)
- Il faudra investiguer plus en profondeur

**IMPORTANT:** Cette version est TEMPORAIRE pour diagnostic uniquement. Les nodes NE FONCTIONNENT PAS comme AI tools dans cette version.

## [1.1.4] - 2025-10-29

### 🔧 Fix: Complete Removal of Legacy Node Files

**Suppression complète des fichiers du node monolithique**

### Fixed

- **SUPPRESSION physique du dossier nodes/Qlynk/** - Le node legacy était retiré du package.json mais les fichiers restaient dans dist/
- **Clean build** - Rebuild complet sans les fichiers Qlynk.node.js
- **Résolution définitive** - Plus aucune trace du node monolithique dans le package npm

### Technical Details

**Problème v1.1.3:**
- Le node était retiré de `package.json` mais les fichiers compilés restaient dans `dist/nodes/Qlynk/`
- npm publish incluait encore ces fichiers → conflit lors de l'installation

**Solution v1.1.4:**
- Suppression physique du dossier `nodes/Qlynk/` et `dist/nodes/Qlynk/`
- Rebuild propre avec uniquement les 11 nodes spécialisés
- Package npm ne contient plus aucune trace du node legacy

## [1.1.3] - 2025-10-29

### 🔧 Fix: Remove Legacy Monolithic Node

**Résolution du conflit "UNIQUE constraint failed: installed_nodes.name"**

### Changed

#### Node Architecture
- **SUPPRESSION du node monolithique "Qlynk"** - Retire le node legacy qui causait des conflits
- **Garde uniquement les 11 nodes spécialisés** - Un node par opération API
- **Résout l'erreur SQLITE_CONSTRAINT** - Plus de conflit de noms lors de l'installation

### Technical Details

**Pourquoi ce changement ?**
- Le node monolithique "Qlynk" (v1.0.0) coexistait avec les 11 nodes spécialisés (v1.1.0+)
- Cette coexistence causait un conflit de noms lors de l'enregistrement dans N8n
- Erreur: `SQLITE_CONSTRAINT: UNIQUE constraint failed: installed_nodes.name`
- Solution: Retirer complètement le node legacy, utiliser uniquement les nodes spécialisés

**Migration depuis v1.0.x:**
Si vous utilisiez le node "Qlynk" monolithique, vous devez migrer vers les nodes spécialisés:
- `Qlynk` (resource: url, operation: create) → `Qlynk URL Create`
- `Qlynk` (resource: url, operation: get) → `Qlynk URL Get`
- `Qlynk` (resource: category, operation: create) → `Qlynk Category Create`
- etc.

**Avantages des nodes spécialisés:**
- ✅ Meilleure découvrabilité dans l'interface N8n
- ✅ Configuration plus simple (pas de sélection resource/operation)
- ✅ Descriptions optimisées pour chaque opération
- ✅ Compatible AI Agent tools sans conflit

## [1.1.2] - 2025-10-29

### 🔄 Republish: Cache Refresh

**Republication de la version 1.1.1** pour résoudre problèmes de cache N8n.

### Fixed

#### Installation & Cache Issues
- **Republish propre** - Force N8n à télécharger une version fraîche et ignorer cache corrompu
- **Résolution erreur JSON parsing** - Erreur "Expected double-quoted property name" lors de l'installation
- **Pas de changements de code** - Fonctionnalité identique à v1.1.1

### Technical Details

**Pourquoi ce republish ?**
- Certaines installations N8n avaient du cache corrompu de v1.1.0 (qui avait l'erreur `supplyData`)
- Le cache empêchait l'installation correcte de v1.1.1
- Une nouvelle version force npm et N8n à tout re-télécharger proprement
- Solution plus simple et fiable que de demander aux utilisateurs de nettoyer manuellement leur cache

**Solution de contournement avant v1.1.2 :**
```bash
# Si vous avez encore des problèmes, nettoyez le cache N8n manuellement
docker exec <container-id> rm -rf /home/node/.n8n/nodes/node_modules/n8n-nodes-qlynk
docker restart <container-id>
```

## [1.1.1] - 2025-10-29

### 🔧 Critical Fix: AI Agent Tool Architecture

**BREAKING CHANGE** from v1.1.0 - Cette version corrige l'erreur "Node already has a 'supplyData' method".

### Fixed

#### Architecture AI Agent Tools
- **SUPPRESSION de `supplyData()`** - Community nodes ne doivent utiliser QUE `execute()`
- **N8n crée automatiquement** un wrapper tool virtuel avec `usableAsTool: true`
- **Plus d'imports LangChain** - Retrait de `@langchain/core` des dépendances
- **Correction tsconfig.json** - Module Node16 pour imports modernes

### Changed

#### Node Implementation Pattern
Les nodes implémentent maintenant **uniquement** :
```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  // Logique du node
}
```

Au lieu de :
```typescript
async supplyData() { ... }  // ❌ ERREUR
async execute() { ... }
```

#### Descriptions optimisées pour AI
- Format "Use this tool when..." pour clarté LLM
- Descriptions détaillées des paramètres
- Exemples de valeurs dans placeholders

### Technical Details

**Pourquoi ce changement ?**
- N8n PR #13075 (v1.79.0) a ajouté le support des community nodes comme AI tools
- Le système crée un "virtual tool wrapper" automatiquement
- Ajouter `supplyData()` manuellement crée un conflit → erreur au runtime

**Configuration requise :**
```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

**Package size** : 26.8 kB (tarball) - Réduction grâce au retrait de LangChain

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
