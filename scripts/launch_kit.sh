#!/bin/bash

# SCRIPT DE LANCEMENT ULTRA-RAPIDE
# Génère tout le contenu nécessaire pour commencer à vendre MAINTENANT

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 LANCEMENT IMMÉDIAT - GÉNÉRATION CONTENU COMPLET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

API_URL="https://rapid-sales-system.preview.emergentagent.com/api"

echo "📦 Récupération des produits..."
PRODUCTS=$(curl -s "$API_URL/products")
echo "✓ Produits chargés"
echo ""

# Export des scripts TikTok
echo "🎬 EXPORT SCRIPTS TIKTOK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p /app/exports/launch_kit

for i in 0 1 2; do
    PRODUCT_NAME=$(echo $PRODUCTS | python3 -c "import sys, json; print(json.load(sys.stdin)[$i]['name'])" 2>/dev/null)
    PRODUCT_ID=$(echo $PRODUCTS | python3 -c "import sys, json; print(json.load(sys.stdin)[$i]['id'])" 2>/dev/null)
    
    if [ ! -z "$PRODUCT_ID" ]; then
        echo "📝 Export: $PRODUCT_NAME"
        
        RESPONSE=$(curl -s "$API_URL/export/tiktok-scripts/$PRODUCT_ID?format=txt")
        CONTENT=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('content', ''))" 2>/dev/null)
        
        if [ ! -z "$CONTENT" ]; then
            FILENAME=$(echo $PRODUCT_NAME | sed 's/ /_/g')
            echo "$CONTENT" > "/app/exports/launch_kit/${FILENAME}_scripts.txt"
            echo "   ✅ Sauvegardé: ${FILENAME}_scripts.txt"
        fi
    fi
done

echo ""
echo "💬 EXPORT MESSAGES DM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DM_RESPONSE=$(curl -s "$API_URL/export/dm-scripts?format=txt")
DM_CONTENT=$(echo $DM_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('content', ''))" 2>/dev/null)

if [ ! -z "$DM_CONTENT" ]; then
    echo "$DM_CONTENT" > "/app/exports/launch_kit/DM_Messages_Closing.txt"
    echo "✅ Messages DM exportés"
fi

echo ""
echo "🔗 GÉNÉRATION LIENS DIRECTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > /app/exports/launch_kit/LIENS_STORE.txt << 'EOF'
═══════════════════════════════════════════════════════════
🔗 LIENS DIRECTS À PARTAGER
═══════════════════════════════════════════════════════════

📱 LIEN PRINCIPAL STORE (À mettre en bio):
https://rapid-sales-system.preview.emergentagent.com/store

💰 LIEN PROGRAMME AFFILIATION (Recruter des affiliés):
https://rapid-sales-system.preview.emergentagent.com/affiliation

📊 DASHBOARD ADMIN (Gérer tes ventes):
https://rapid-sales-system.preview.emergentagent.com/

═══════════════════════════════════════════════════════════
📝 BIO OPTIMISÉE POUR TIKTOK/INSTAGRAM
═══════════════════════════════════════════════════════════

Option 1 (Simple):
🔥 Produits tendances à prix cassés
💰 Paiement sécurisé
👇 SHOP

Option 2 (Urgence):
⚠️ Stock limité - Livraison 48h
💎 Qualité premium
🛍️ Commande maintenant

Option 3 (Aspirationnelle):
✨ Transforme ton quotidien
🎁 Nouveautés chaque semaine
🛒 Découvre

═══════════════════════════════════════════════════════════
💬 MESSAGES DE RÉPONSE RAPIDE
═══════════════════════════════════════════════════════════

Quand quelqu'un commente "Lien?":
👉 Lien en bio ! Stock limité 🔥

Quand quelqu'un demande le prix:
39€ seulement ! Livraison rapide 📦 Lien en bio

Quand quelqu'un demande si c'est bien:
J'ai commandé le mien, qualité au top ! 
Lien en bio pour commander 💯

═══════════════════════════════════════════════════════════
🎯 HASHTAGS PUISSANTS
═══════════════════════════════════════════════════════════

Mix 1 (Viralité):
#tiktokmademebuyit #amazonfinds #musthave #viral #foryou

Mix 2 (Produit):
#shopping #deals #gadgets #lifestyle #trending

Mix 3 (Urgence):
#limitedstock #flashsale #exclusive #newin #shopnow

═══════════════════════════════════════════════════════════
EOF

echo "✅ Liens et ressources générés"

echo ""
echo "📋 CRÉATION CHECKLIST DE LANCEMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > /app/exports/launch_kit/CHECKLIST_LANCEMENT.md << 'EOF'
# ✅ CHECKLIST DE LANCEMENT - PREMIÈRES VENTES EN 24H

## ⚡ PHASE 1 : MAINTENANT (30 minutes)

### 1. CONFIGURER LES COMPTES SOCIAUX (10 min)
- [ ] Créer/Optimiser compte TikTok principal
- [ ] Créer/Optimiser compte Instagram principal
- [ ] Mettre le lien store en bio des 2 comptes
- [ ] Photo de profil professionnelle
- [ ] Bio accrocheuse (templates fournis)

### 2. PRÉPARER LE CONTENU (10 min)
- [ ] Ouvrir fichiers scripts exportés
- [ ] Lire les 5 premiers scripts de chaque produit
- [ ] Sélectionner les 3 hooks les plus percutants
- [ ] Noter les idées de vidéos à filmer

### 3. PREMIÈRE VIDÉO (10 min)
- [ ] Choisir 1 produit (recommandé: Galaxy Projector)
- [ ] Utiliser script #1 ou #2
- [ ] Filmer vidéo courte (15-30 sec)
- [ ] Montage rapide (CapCut/InShot)
- [ ] POSTER !

---

## 🎬 PHASE 2 : AUJOURD'HUI (2 heures)

### 4. CRÉER 10 VIDÉOS (1h30)
- [ ] Vidéo 1-3: Galaxy Projector (scripts fournis)
- [ ] Vidéo 4-6: Wireless Earbuds (scripts fournis)
- [ ] Vidéo 7-10: Mix autres produits

### 5. POSTER STRATÉGIQUEMENT (30 min)
- [ ] Poster 3 vidéos sur TikTok (espacement 2h)
- [ ] Poster 3 vidéos sur Instagram Reels
- [ ] Stories Instagram avec lien direct
- [ ] Posts Facebook avec lien

### 6. ENGAGEMENT INITIAL
- [ ] Répondre à TOUS les commentaires dans l'heure
- [ ] Utiliser messages de réponse rapide fournis
- [ ] Partager dans groupes Facebook pertinents
- [ ] Envoyer à liste WhatsApp/Telegram personnelle

---

## 📊 PHASE 3 : CE SOIR (1 heure)

### 7. VÉRIFIER PREMIÈRES STATS
- [ ] Ouvrir dashboard admin
- [ ] Vérifier analytics (vues, clics)
- [ ] Identifier vidéo qui performe le mieux
- [ ] Noter patterns (quel produit, quel script)

### 8. OPTIMISER
- [ ] Créer 5 nouvelles vidéos similaires au top post
- [ ] Programmer pour lendemain matin
- [ ] Préparer réponses DM avec messages fournis

---

## 🚀 PHASE 4 : DEMAIN ET APRÈS

### 9. SCALING CONTENU (2h/jour)
- [ ] Poster 10 vidéos/jour minimum
- [ ] Utiliser tous les scripts fournis (60+)
- [ ] Tester différents produits
- [ ] Varier les hooks

### 10. RECRUTER AFFILIÉS
- [ ] Partager lien programme affiliation
- [ ] Recruter 10 premiers affiliés
- [ ] Leur donner accès aux 100 contenus
- [ ] Créer groupe WhatsApp affiliés

### 11. GESTION QUOTIDIENNE
- [ ] Check commandes matin et soir
- [ ] Répondre tous DMs dans l'heure
- [ ] Mettre à jour statuts commandes
- [ ] Analyser meilleurs produits

---

## 🎯 OBJECTIFS PROGRESSIFS

### Semaine 1:
- [ ] 50 vidéos postées
- [ ] Première vente (1-100€)
- [ ] 5 affiliés recrutés

### Semaine 2:
- [ ] 100 vidéos postées
- [ ] 5-10 ventes (100-500€)
- [ ] 10 affiliés actifs

### Semaine 3-4:
- [ ] 200+ vidéos postées
- [ ] 20+ ventes (500-1000€)
- [ ] 20+ affiliés générant du trafic

---

## 💡 TIPS CRITIQUES

✅ **FOCUS**: 1 produit = 10 vidéos avant de passer au suivant
✅ **CONSTANCE**: Poster TOUS les jours, même week-end
✅ **VITESSE**: Réponds aux DMs en <1h pour max conversions
✅ **TEST**: Change 1 variable à la fois (hook, CTA, hashtags)
✅ **TRACK**: Note ce qui marche, double down dessus

❌ **ÉVITER**: 
- Poster 1 fois puis attendre
- Ignorer les commentaires
- Changer de stratégie trop vite
- Complexifier (simple = gagnant)

---

## 🔥 MESSAGE MOTIVATIONNEL

Tu as TOUT ce qu'il faut:
✅ Store fonctionnel
✅ 60+ scripts TikTok
✅ 5 messages DM closing
✅ 100 contenus affiliation
✅ Système automatisé

Il ne manque QUE l'action !

**PREMIÈRE VIDÉO = PREMIÈRE VENTE**

Go ! 🚀
EOF

echo "✅ Checklist créée"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ KIT DE LANCEMENT COMPLET GÉNÉRÉ !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 TOUS LES FICHIERS SONT DANS: /app/exports/launch_kit/"
echo ""
echo "📋 FICHIERS GÉNÉRÉS:"
ls -lh /app/exports/launch_kit/ | awk '{print "   • " $9}'
echo ""
echo "🎯 PROCHAINE ACTION:"
echo "   1. Ouvre les fichiers dans /app/exports/launch_kit/"
echo "   2. Commence par CHECKLIST_LANCEMENT.md"
echo "   3. Première vidéo = Première vente !"
echo ""
echo "💰 OBJECTIF: PREMIÈRE VENTE SOUS 24H"
echo ""
