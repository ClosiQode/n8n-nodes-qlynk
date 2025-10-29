# Commandes de dépannage N8n - n8n-nodes-qlynk

## Problème : Nodes n'apparaissent pas après mise à jour

Si les nodes n'apparaissent pas dans N8n après la mise à jour vers v1.1.1, suivez ces étapes :

### 1. Désinstaller complètement le package dans N8n

**Via l'interface N8n :**
1. Aller dans **Settings** → **Community Nodes**
2. Trouver `n8n-nodes-qlynk`
3. Cliquer sur **Delete** / **Supprimer**
4. Confirmer la suppression

**OU via CLI (si N8n est en Docker) :**
```bash
# Se connecter au container N8n
docker exec -it <container-name> /bin/sh

# Désinstaller le package
npm uninstall n8n-nodes-qlynk

# Sortir du container
exit
```

### 2. Vider le cache N8n

**Si N8n est en Docker :**
```bash
# Arrêter N8n
docker stop <container-name>

# Supprimer le cache
docker exec <container-name> rm -rf /home/node/.n8n/nodes/*

# Redémarrer N8n
docker start <container-name>
```

**Si N8n est installé localement :**
```bash
# Arrêter N8n
pm2 stop n8n

# Vider le cache
rm -rf ~/.n8n/nodes/*

# Redémarrer N8n
pm2 restart n8n
```

### 3. Réinstaller le package

**Via l'interface N8n :**
1. Aller dans **Settings** → **Community Nodes**
2. Cliquer sur **Install**
3. Entrer : `n8n-nodes-qlynk`
4. Installer

### 4. Vérifier la variable d'environnement

**IMPORTANT** : Pour utiliser les nodes comme AI tools :

```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

### 5. Redémarrer N8n complètement

```bash
# Docker
docker restart <container-name>

# PM2
pm2 restart n8n
```

### 6. Vérifier l'installation

Après redémarrage, tu devrais voir **12 nodes Qlynk** :
- Qlynk (node legacy)
- Qlynk URL Create/Get/List/Update/Delete
- Qlynk Category Create/Get/List/Update/Delete
- Qlynk Stats

## Dépannage rapide

### Forcer la réinstallation complète

```bash
# 1. Désinstaller
npm uninstall n8n-nodes-qlynk

# 2. Vider npm cache
npm cache clean --force

# 3. Vider le cache N8n
rm -rf ~/.n8n/nodes/*

# 4. Réinstaller
npm install n8n-nodes-qlynk@latest

# 5. Redémarrer N8n
```

## Différence v1.1.0 → v1.1.1

**v1.1.0 (BUGGÉE)** :
- ❌ Erreur "Node already has a 'supplyData' method"
- ❌ Nodes ne fonctionnent pas comme AI tools

**v1.1.1 (CORRIGÉE)** :
- ✅ Architecture correcte sans supplyData()
- ✅ Nodes fonctionnent comme AI tools

**OBLIGATOIRE de désinstaller v1.1.0 complètement avant d'installer v1.1.1**
