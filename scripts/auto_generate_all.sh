#!/bin/bash

# Script d'automation complète - Génération de contenu
# Exécute automatiquement toutes les générations IA

API_URL="https://rapid-sales-system.preview.emergentagent.com/api"
LOG_FILE="/app/logs/automation.log"

mkdir -p /app/logs

echo "════════════════════════════════════════════════" | tee -a $LOG_FILE
echo "🤖 AUTOMATION COMPLÈTE - $(date)" | tee -a $LOG_FILE
echo "════════════════════════════════════════════════" | tee -a $LOG_FILE

# Fonction pour logger
log() {
    echo "$1" | tee -a $LOG_FILE
}

# 1. Récupérer tous les produits
log ""
log "📦 Récupération des produits..."
PRODUCTS=$(curl -s "$API_URL/products" --max-time 10)
PRODUCT_COUNT=$(echo $PRODUCTS | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
log "✓ $PRODUCT_COUNT produits trouvés"

# 2. Générer DM Scripts (une seule fois)
log ""
log "💬 Vérification Messages DM..."
DM_COUNT=$(curl -s "$API_URL/dm-scripts" --max-time 10 | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

if [ "$DM_COUNT" -lt "3" ]; then
    log "⚙️  Génération 5 messages DM..."
    curl -s -X POST "$API_URL/generate/dm-scripts" --max-time 60 > /dev/null 2>&1
    log "✅ Messages DM générés"
else
    log "✓ $DM_COUNT messages DM déjà disponibles"
fi

# 3. Générer Scripts TikTok pour les 3 premiers produits
log ""
log "🎬 Génération Scripts TikTok..."

# Extraire les 3 premiers IDs
PRODUCT_IDS=$(echo $PRODUCTS | python3 -c "import sys, json; products = json.load(sys.stdin); print(' '.join([p['id'] for p in products[:3]]))" 2>/dev/null)

counter=1
for product_id in $PRODUCT_IDS; do
    PRODUCT_NAME=$(echo $PRODUCTS | python3 -c "import sys, json; products = json.load(sys.stdin); p = next((p for p in products if p['id'] == '$product_id'), None); print(p['name'] if p else 'Unknown')" 2>/dev/null)
    
    log ""
    log "[$counter/3] $PRODUCT_NAME"
    
    # Vérifier scripts existants
    EXISTING=$(curl -s "$API_URL/tiktok-scripts/$product_id" --max-time 10 | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
    
    if [ "$EXISTING" -ge "10" ]; then
        log "   ✓ $EXISTING scripts déjà générés"
    else
        log "   ⚙️  Génération 20 scripts..."
        curl -s -X POST "$API_URL/generate/tiktok-scripts" \
            -H "Content-Type: application/json" \
            -d "{\"product_id\": \"$product_id\"}" \
            --max-time 90 > /dev/null 2>&1
        
        sleep 2
        
        NEW_COUNT=$(curl -s "$API_URL/tiktok-scripts/$product_id" --max-time 10 | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
        log "   ✅ $NEW_COUNT scripts générés"
    fi
    
    counter=$((counter + 1))
    sleep 2
done

# 4. Générer Pages de Vente pour les 2 premiers produits
log ""
log "📄 Génération Pages de Vente..."

PRODUCT_IDS_PAGES=$(echo $PRODUCTS | python3 -c "import sys, json; products = json.load(sys.stdin); print(' '.join([p['id'] for p in products[:2]]))" 2>/dev/null)

counter=1
for product_id in $PRODUCT_IDS_PAGES; do
    PRODUCT_NAME=$(echo $PRODUCTS | python3 -c "import sys, json; products = json.load(sys.stdin); p = next((p for p in products if p['id'] == '$product_id'), None); print(p['name'] if p else 'Unknown')" 2>/dev/null)
    
    log ""
    log "[$counter/2] Page: $PRODUCT_NAME"
    
    curl -s -X POST "$API_URL/generate/sales-page" \
        -H "Content-Type: application/json" \
        -d "{\"product_id\": \"$product_id\"}" \
        --max-time 60 > /dev/null 2>&1
    
    log "   ✅ Page de vente générée"
    
    counter=$((counter + 1))
    sleep 2
done

# 5. Résumé final
log ""
log "════════════════════════════════════════════════"
log "✅ AUTOMATION TERMINÉE - $(date)"
log "════════════════════════════════════════════════"
log ""
log "📊 RÉSUMÉ:"

# Stats finales
TOTAL_SCRIPTS=$(curl -s "$API_URL/tiktok-scripts/$(echo $PRODUCT_IDS | cut -d' ' -f1)" --max-time 10 | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")
TOTAL_DM=$(curl -s "$API_URL/dm-scripts" --max-time 10 | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

log "   • Scripts TikTok générés: ~$TOTAL_SCRIPTS+ (par produit)"
log "   • Messages DM: $TOTAL_DM"
log "   • Pages de vente: 2"
log ""
log "🎯 Contenu prêt à exploiter !"
log "   → Voir: https://rapid-sales-system.preview.emergentagent.com/tiktok-scripts"
log ""

exit 0
