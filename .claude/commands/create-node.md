# Create n8n Node Command

Utilise l'agent n8n-node-creator pour créer un nouveau node n8n en suivant toutes les bonnes pratiques.

## Instructions

1. Lis le guide complet dans `GUIDE_CREATION_NODES.md`
2. Utilise l'agent `.claude/agents/n8n-node-creator.md` pour générer le code
3. Vérifie OBLIGATOIREMENT que :
   - Les noms de nodes sont VARIÉS (pas de préfixe répétitif identique)
   - tsconfig.json utilise `"module": "commonjs"`
   - Tous les fichiers suivent les conventions de nommage
4. Génère le code complet du node
5. Présente la checklist de validation finale à l'utilisateur

## Utilisation

```bash
/create-node
```

Puis réponds aux questions :
- Quel service/API ?
- Quelles opérations (CRUD, custom) ?
- Nom du package ?
- Support AI Agent ?
