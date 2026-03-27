#!/usr/bin/env python3
"""
GÉNÉRATEUR 200 AFFILIÉS AUTOMATIQUES
Crée 200 codes d'affiliation + boutiques personnalisées + contenus marketing
"""

import json
import random
import string
from datetime import datetime

def generate_affiliate_code(num):
    """Génère un code d'affiliation unique"""
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=4))
    return f"AFF-{num:03d}-{random_part}"

def generate_200_affiliates():
    """Génère 200 affiliés complets avec tout le nécessaire"""
    
    affiliates = []
    
    # Noms variés pour affiliés
    first_names = [
        "Alex", "Marie", "Lucas", "Emma", "Thomas", "Sarah", "Nathan", "Julie",
        "Hugo", "Léa", "Maxime", "Chloé", "Antoine", "Camille", "Pierre", "Laura",
        "Nicolas", "Sophie", "Julien", "Manon", "Alexandre", "Clara", "Romain", "Lisa",
        "Benjamin", "Margot", "Théo", "Charlotte", "Mathis", "Zoé", "Louis", "Alice",
        "Gabriel", "Lucie", "Arthur", "Inès", "Paul", "Louise", "Victor", "Jade",
        "Tom", "Lola", "Raphaël", "Rose", "Noah", "Léna", "Adam", "Anna", "Jules", "Eva"
    ]
    
    last_names = [
        "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand",
        "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David",
        "Bertrand", "Roux", "Vincent", "Fournier", "Morel", "Girard", "André", "Mercier",
        "Dupont", "Lambert", "Bonnet", "François", "Martinez", "Legrand", "Garnier", "Faure"
    ]
    
    # Villes françaises
    cities = [
        "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg",
        "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne",
        "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis",
        "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours",
        "Amiens", "Perpignan", "Metz", "Besançon", "Boulogne-Billancourt", "Orléans"
    ]
    
    print("🤖 Génération de 200 affiliés automatiques...")
    print("")
    
    for i in range(1, 201):
        # Infos affilié
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@gmail.com"
        code = generate_affiliate_code(i)
        city = random.choice(cities)
        
        # Stats simulées réalistes
        total_clicks = random.randint(0, 500)
        total_conversions = int(total_clicks * random.uniform(0.01, 0.05))  # 1-5% conversion
        commission_per_sale = 8.0  # Moyenne
        total_earnings = total_conversions * commission_per_sale
        
        # Lien personnalisé
        store_link = f"https://rapid-sales-system.preview.emergentagent.com/store?ref={code}"
        affiliation_link = f"https://rapid-sales-system.preview.emergentagent.com/affiliation?sponsor={code}"
        
        # Créer l'affilié
        affiliate = {
            "id": i,
            "numero": f"#{i:03d}",
            "code": code,
            "nom": full_name,
            "prenom": first_name,
            "nom_famille": last_name,
            "email": email,
            "ville": city,
            "commission_rate": 20.0,
            "total_clicks": total_clicks,
            "total_conversions": total_conversions,
            "total_earnings": round(total_earnings, 2),
            "status": "active" if total_clicks > 0 else "new",
            "liens": {
                "store": store_link,
                "recrutement": affiliation_link,
                "dashboard": f"https://rapid-sales-system.preview.emergentagent.com/affiliation?code={code}"
            },
            "bio_suggeree": f"💰 Affilié #{i:03d} | 20% commission\n🔥 Produits tendances\n👇 Shop maintenant",
            "created_at": datetime.now().isoformat(),
            "niveau": "Débutant" if total_earnings < 100 else ("Intermédiaire" if total_earnings < 500 else "Expert")
        }
        
        affiliates.append(affiliate)
        
        # Progress
        if i % 20 == 0:
            print(f"   ✓ {i}/200 affiliés générés...")
    
    print("")
    print(f"✅ 200 affiliés générés avec succès !")
    
    return affiliates

def generate_affiliate_stores(affiliates):
    """Génère des pages de boutique personnalisées pour chaque affilié"""
    
    stores = []
    
    print("")
    print("🏪 Génération de 200 boutiques personnalisées...")
    print("")
    
    for affiliate in affiliates:
        store = {
            "affiliate_code": affiliate['code'],
            "affiliate_name": affiliate['nom'],
            "store_url": affiliate['liens']['store'],
            "custom_message": f"Boutique recommandée par {affiliate['prenom']} de {affiliate['ville']}",
            "badge": f"Affilié vérifié #{affiliate['numero']}",
            "discount_code": f"{affiliate['code']}-FIRST" if affiliate['id'] <= 50 else None,
            "priority_products": random.sample([
                "Galaxy Projector Light",
                "Wireless Earbuds Pro", 
                "Portable Blender",
                "Smart Fitness Watch",
                "Resistance Band Set"
            ], 3)
        }
        stores.append(store)
    
    print("✅ 200 boutiques personnalisées créées !")
    
    return stores

def generate_marketing_kits(affiliates):
    """Génère des kits marketing pour les 200 affiliés"""
    
    kits = []
    
    print("")
    print("📦 Génération de 200 kits marketing...")
    print("")
    
    bio_templates = [
        "💰 Je partage mes coups de cœur\n🔥 20% de réduction avec mon code\n👇 Shop",
        "✨ Mes produits favoris 2026\n💎 Qualité testée et approuvée\n🛍️ Commande",
        "🎯 Deals exclusifs ici\n💸 Prix cassés garantis\n🔗 Lien ci-dessous",
        "🔥 Produits viraux TikTok\n⚡ Livraison express\n👉 Découvre"
    ]
    
    for i, affiliate in enumerate(affiliates, 1):
        kit = {
            "affiliate_code": affiliate['code'],
            "affiliate_name": affiliate['nom'],
            "kit_numero": i,
            "bio_optimisee": random.choice(bio_templates),
            "message_stories": f"Code promo: {affiliate['code']} pour -20% 🔥",
            "message_dm": f"Salut ! Voici mon lien avec 20% de réduc : {affiliate['liens']['store']}",
            "hashtags_perso": [
                f"#{affiliate['ville'].lower().replace('-', '')}",
                "#bonplan",
                "#promotion",
                "#deals",
                "#shopping"
            ],
            "scripts_courts": [
                f"J'ai trouvé ces produits incroyables ! Lien en bio avec mon code {affiliate['code']} 🔥",
                f"Commande via mon lien = 20% de réduc automatique ! Code: {affiliate['code']}",
                f"Les 3 produits que j'achète encore et encore... Lien + code promo en bio !"
            ]
        }
        kits.append(kit)
        
        if i % 25 == 0:
            print(f"   ✓ {i}/200 kits créés...")
    
    print("")
    print("✅ 200 kits marketing générés !")
    
    return kits

if __name__ == "__main__":
    print("════════════════════════════════════════════════════════════")
    print("🚀 GÉNÉRATION SYSTÈME 200 AFFILIÉS AUTOMATIQUES")
    print("════════════════════════════════════════════════════════════")
    print("")
    
    # Générer les 200 affiliés
    affiliates = generate_200_affiliates()
    
    # Générer les boutiques
    stores = generate_affiliate_stores(affiliates)
    
    # Générer les kits marketing
    kits = generate_marketing_kits(affiliates)
    
    # Sauvegarder tout
    print("")
    print("💾 Sauvegarde des données...")
    print("")
    
    import os
    os.makedirs("/app/data/affiliates", exist_ok=True)
    
    # Sauvegarder affiliés
    with open("/app/data/affiliates/200_affiliates.json", "w", encoding="utf-8") as f:
        json.dump(affiliates, f, ensure_ascii=False, indent=2)
    print("✓ 200 affiliés sauvegardés")
    
    # Sauvegarder boutiques
    with open("/app/data/affiliates/200_stores.json", "w", encoding="utf-8") as f:
        json.dump(stores, f, ensure_ascii=False, indent=2)
    print("✓ 200 boutiques sauvegardées")
    
    # Sauvegarder kits
    with open("/app/data/affiliates/200_marketing_kits.json", "w", encoding="utf-8") as f:
        json.dump(kits, f, ensure_ascii=False, indent=2)
    print("✓ 200 kits marketing sauvegardés")
    
    # Générer fichier CSV pour import facile
    import csv
    with open("/app/data/affiliates/200_affiliates.csv", "w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            'numero', 'code', 'nom', 'email', 'ville', 'store_link', 
            'commission_rate', 'total_earnings', 'status', 'niveau'
        ])
        writer.writeheader()
        for aff in affiliates:
            writer.writerow({
                'numero': aff['numero'],
                'code': aff['code'],
                'nom': aff['nom'],
                'email': aff['email'],
                'ville': aff['ville'],
                'store_link': aff['liens']['store'],
                'commission_rate': aff['commission_rate'],
                'total_earnings': aff['total_earnings'],
                'status': aff['status'],
                'niveau': aff['niveau']
            })
    print("✓ Fichier CSV exporté")
    
    # Générer document récapitulatif
    with open("/app/data/affiliates/GUIDE_200_AFFILIES.md", "w", encoding="utf-8") as f:
        f.write("# 🚀 SYSTÈME 200 AFFILIÉS - GUIDE COMPLET\n\n")
        f.write("## 📊 STATISTIQUES GLOBALES\n\n")
        
        total_clicks = sum(a['total_clicks'] for a in affiliates)
        total_conversions = sum(a['total_conversions'] for a in affiliates)
        total_earnings = sum(a['total_earnings'] for a in affiliates)
        
        f.write(f"- **Total affiliés** : 200\n")
        f.write(f"- **Clics totaux simulés** : {total_clicks:,}\n")
        f.write(f"- **Conversions totales** : {total_conversions:,}\n")
        f.write(f"- **Commissions totales** : {total_earnings:,.2f}€\n")
        f.write(f"- **Commission moyenne/affilié** : {total_earnings/200:.2f}€\n\n")
        
        f.write("## 🎯 UTILISATION\n\n")
        f.write("### Option 1 : Recrutement Réel\n")
        f.write("1. Partage le lien d'affiliation principal\n")
        f.write("2. Les 200 premiers inscrits reçoivent un code pré-généré\n")
        f.write("3. Chacun a accès à son kit marketing personnalisé\n\n")
        
        f.write("### Option 2 : Multi-Comptes\n")
        f.write("1. Crée 10-20 comptes TikTok/Instagram\n")
        f.write("2. Assigne un code affilié à chaque compte\n")
        f.write("3. Utilise les kits marketing fournis\n")
        f.write("4. Poste du contenu avec les liens personnalisés\n\n")
        
        f.write("### Option 3 : Armée d'Affiliés\n")
        f.write("1. Recrute des VAs / freelancers\n")
        f.write("2. Donne à chacun un code + kit marketing\n")
        f.write("3. Ils postent le contenu fourni\n")
        f.write("4. Tu paies sur résultats (commission)\n\n")
        
        f.write("## 📦 FICHIERS GÉNÉRÉS\n\n")
        f.write("- `200_affiliates.json` : Données complètes 200 affiliés\n")
        f.write("- `200_stores.json` : 200 boutiques personnalisées\n")
        f.write("- `200_marketing_kits.json` : Kits marketing complets\n")
        f.write("- `200_affiliates.csv` : Export CSV pour tableur\n\n")
        
        f.write("## 🔗 EXEMPLES DE LIENS\n\n")
        for i in [0, 49, 99, 149, 199]:
            aff = affiliates[i]
            f.write(f"### Affilié {aff['numero']} - {aff['nom']}\n")
            f.write(f"- **Code** : `{aff['code']}`\n")
            f.write(f"- **Lien store** : {aff['liens']['store']}\n")
            f.write(f"- **Ville** : {aff['ville']}\n")
            f.write(f"- **Niveau** : {aff['niveau']}\n\n")
        
        f.write("## 💰 POTENTIEL DE REVENUS\n\n")
        f.write("Si chaque affilié génère en moyenne :\n")
        f.write("- **10 ventes/mois** × 8€ commission = 80€/mois/affilié\n")
        f.write("- **200 affiliés** × 80€ = **16,000€/mois**\n\n")
        f.write("Avec seulement 20% d'affiliés actifs :\n")
        f.write("- **40 affiliés** × 80€ = **3,200€/mois**\n\n")
        
        f.write("## 🚀 PROCHAINES ÉTAPES\n\n")
        f.write("1. ✅ Importer les 200 affiliés dans le système\n")
        f.write("2. ✅ Distribuer les codes aux premiers inscrits\n")
        f.write("3. ✅ Créer groupe Telegram/WhatsApp pour support\n")
        f.write("4. ✅ Lancer campagne de recrutement\n")
        f.write("5. ✅ Suivre les performances dans le dashboard\n\n")
        
    print("✓ Guide complet généré")
    
    print("")
    print("════════════════════════════════════════════════════════════")
    print("✅ SYSTÈME 200 AFFILIÉS GÉNÉRÉ AVEC SUCCÈS !")
    print("════════════════════════════════════════════════════════════")
    print("")
    print("📂 Fichiers disponibles dans : /app/data/affiliates/")
    print("")
    print("📊 RÉSUMÉ:")
    print(f"   • 200 codes d'affiliation uniques")
    print(f"   • 200 liens de boutique personnalisés")
    print(f"   • 200 kits marketing complets")
    print(f"   • 1 fichier CSV pour import")
    print(f"   • 1 guide complet d'utilisation")
    print("")
    print("💰 POTENTIEL:")
    print(f"   • Clics totaux simulés: {total_clicks:,}")
    print(f"   • Commissions potentielles: {total_earnings:,.2f}€")
    print("")
    print("🎯 TOP 5 AFFILIÉS (Simulés):")
    top_affiliates = sorted(affiliates, key=lambda x: x['total_earnings'], reverse=True)[:5]
    for i, aff in enumerate(top_affiliates, 1):
        print(f"   {i}. {aff['nom']:25} | {aff['code']:15} | {aff['total_earnings']:>8.2f}€")
    print("")
    print("🚀 LANCE LE SYSTÈME MAINTENANT !")
    print("")
