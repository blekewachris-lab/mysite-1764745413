#!/usr/bin/env python3
"""
Générateur automatique de 100 contenus marketing pour affiliation
Exécute et sauvegarde dans un fichier JSON
"""

import json
import random
from datetime import datetime

def generate_100_affiliate_contents():
    """Génère 100 contenus marketing prêts à l'emploi"""
    
    contents = []
    
    # Templates variés
    hooks = [
        "Je gagne {}€/mois sans boss",
        "Comment transformer tes followers en revenu",
        "Le side hustle que personne ne connaît",
        "De 0 à {}€ en {} jours",
        "Pourquoi je ne cherche plus de job",
        "Mon secret pour gagner {}€/semaine",
        "Arrête de scroller, commence à gagner",
        "Le business model le plus simple",
        "Comment je finance mes vacances",
        "Revenu passif : Mon expérience réelle",
        "Tu scrolles, je gagne : voici comment",
        "Marketing d'affiliation : La vérité",
        "{}€ ce mois-ci en partageant des produits",
        "Mon side hustle préféré en 2026",
        "Gagner de l'argent en aimant des produits",
        "Le programme qui a changé ma vie",
        "Comment je fais {} ventes par jour",
        "Affiliation : Mon bilan après {} mois",
        "{}€ de commission cette semaine",
        "Le secret des influenceurs rentables"
    ]
    
    stories_templates = [
        "J'ai découvert le marketing d'affiliation il y a {} mois. Aujourd'hui je gagne {}€/mois en partageant des produits. Zero stock, zero risque. Juste un lien et de la passion. Commission : 20% sur chaque vente.",
        "Tu as {} followers ? Transforme-les en revenu ! Partage des produits tendances, touche 20% de commission. Je fais {}€/mois comme ça. Programme gratuit, inscription en 2 minutes.",
        "Mon objectif : {}€/mois en affiliation. Actuellement à {}€. Stratégie : poster {} fois/jour, répondre à tous les DMs, être authentique. Ça marche ! Rejoins-moi.",
        "Les gens me demandent comment je gagne en ligne. Simple : j'aide des marques à vendre. Ils me paient 20% par vente. J'ai fait {}€ ce mois-ci. Inscription gratuite dans le lien.",
        "Sceptique sur l'affiliation ? J'étais pareil. Mois 1 : {}€. Mois 2 : {}€. Maintenant : {}€/mois stable. Commission garantie 20%. Programme ouvert à tous.",
        "Le marketing d'affiliation m'a permis de quitter mon job. Revenus actuels : {}€/mois. Temps investi : {}h/semaine. Investissement : 0€. Rejoins {} affiliés déjà actifs.",
        "Ma routine : 30 minutes le matin, {} posts par jour, réponse aux DMs le soir. Résultat : {}€/semaine en moyenne. Commission de 20% sur tous les produits.",
        "Pourquoi l'affiliation marche : tu recommandes des produits que tu aimes, tes followers les achètent, tu gagnes une commission. J'ai fait {}€ en {} jours. Commence maintenant.",
        "J'ai testé plein de side hustles. L'affiliation est le plus simple : pas de stock, pas d'investissement, pas de service client. Juste partager et gagner. {}€ ce mois-ci.",
        "Avant : Job 9h-18h pour {}€/mois. Maintenant : Side hustle affiliation {}h/semaine pour {}€/mois. Commission 20% + produits gratuits. Programme ouvert.",
        "Tu veux gagner de l'argent en ligne ? L'affiliation c'est : 1) Inscription gratuite 2) Récupère tes liens 3) Partage les produits 4) Touche 20%. J'ai fait {}€ ce mois.",
        "Mes 3 produits préférés à promouvoir : Galaxy Projector (39€), Earbuds (29€), Blender (45€). Commission moyenne : {}€ par vente. {} ventes ce mois = {}€ gagnés.",
        "Le programme d'affiliation le plus généreux : 20% de commission, paiement garanti, {} produits tendances, support 7j/7. J'ai gagné {}€ en {} semaines.",
        "Marketing d'affiliation vs dropshipping : Affiliation = 0€ d'investissement, pas de gestion stock, commission immédiate. Dropshipping = stress + coûts. Mon choix : {}€/mois en affiliation.",
        "Comment je scale : Mois 1 = {}€ (test), Mois 2 = {}€ (optimisation), Mois 3 = {}€ (scale). Stratégie : {} comptes, {} posts/jour, 20% commission."
    ]
    
    ctas = [
        "Rejoins maintenant - Lien en bio",
        "Inscris-toi gratuitement",
        "Commence aujourd'hui - 0€",
        "Clique le lien dans ma bio",
        "DM moi pour le lien d'inscription",
        "Swipe up pour devenir affilié",
        "Programme gratuit - Rejoins-nous",
        "Lien d'inscription en bio",
        "Démarre ton side hustle maintenant",
        "Essaie gratuitement - Sans risque",
        "Inscription en 2 min - Lien en bio",
        "Rejoins {} affiliés actifs",
        "Commission 20% garantie - S'inscrire",
        "Commence à gagner - Lien ci-dessous",
        "Programme ouvert à tous - Rejoindre"
    ]
    
    platforms = ["tiktok", "instagram", "facebook", "twitter", "youtube", "linkedin"]
    types = ["post", "story", "reel", "video"]
    
    # Générer 100 contenus uniques
    for i in range(1, 101):
        # Choix aléatoires
        platform = random.choice(platforms)
        content_type = random.choice(types)
        hook_template = random.choice(hooks)
        story_template = random.choice(stories_templates)
        cta_template = random.choice(ctas)
        
        # Valeurs dynamiques
        amounts = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500]
        small_amounts = [50, 75, 100, 150, 200, 250]
        days = [7, 14, 21, 30, 60, 90]
        months = [1, 2, 3, 4, 6]
        posts_per_day = [3, 5, 7, 10]
        hours = [2, 3, 5, 10]
        followers = ["100", "500", "1K", "2K", "5K"]
        affiliates_count = [50, 100, 200, 500]
        
        # Formater hook
        try:
            if "{}" in hook_template:
                count = hook_template.count("{}")
                if count == 1:
                    hook = hook_template.format(random.choice(amounts))
                elif count == 2:
                    hook = hook_template.format(random.choice(amounts), random.choice(days))
                else:
                    hook = hook_template.format(*[random.choice(amounts) for _ in range(count)])
            else:
                hook = hook_template
        except:
            hook = hook_template
        
        # Formater story
        try:
            story = story_template.format(
                random.choice(months),
                random.choice(amounts),
                random.choice(small_amounts),
                random.choice(amounts),
                random.choice(posts_per_day),
                random.choice(followers),
                random.choice(hours),
                random.choice(days),
                random.choice(affiliates_count)
            )
        except:
            story = story_template
        
        # Formater CTA
        try:
            if "{}" in cta_template:
                cta = cta_template.format(random.choice(affiliates_count))
            else:
                cta = cta_template
        except:
            cta = cta_template
        
        # Hashtags
        all_hashtags = [
            "#affiliatemarketing", "#sidehustle", "#entrepreneur",
            "#businessonline", "#revenupassif", "#marketing",
            "#argent", "#motivation", "#success", "#liberté",
            "#business", "#marketingdigital", "#revenus",
            "#travailadomicile", "#independancefinanciere"
        ]
        hashtags = random.sample(all_hashtags, min(5, len(all_hashtags)))
        
        # Créer le contenu
        content = {
            "id": i,
            "numero": f"#{i:03d}",
            "type": content_type,
            "platform": platform,
            "hook": hook,
            "contenu": story,
            "cta": cta,
            "hashtags": hashtags,
            "commission": "20%",
            "lien": "https://rapid-sales-system.preview.emergentagent.com/store?ref=TON_CODE",
            "created_at": datetime.now().isoformat()
        }
        
        contents.append(content)
    
    return contents

if __name__ == "__main__":
    print("🤖 Génération de 100 contenus marketing pour affiliation...")
    print("")
    
    contents = generate_100_affiliate_contents()
    
    # Sauvegarder dans un fichier JSON
    output_file = "/app/data/affiliate_contents_100.json"
    
    import os
    os.makedirs("/app/data", exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(contents, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 100 contenus générés et sauvegardés dans: {output_file}")
    print("")
    print("📊 APERÇU DES CONTENUS:")
    print("")
    
    # Afficher 3 exemples
    for i in [0, 49, 99]:
        content = contents[i]
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"CONTENU {content['numero']} - {content['platform'].upper()} {content['type'].upper()}")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"🔥 HOOK: {content['hook']}")
        print(f"")
        print(f"📱 CONTENU: {content['contenu'][:150]}...")
        print(f"")
        print(f"👉 CTA: {content['cta']}")
        print(f"")
        print(f"#️⃣ HASHTAGS: {' '.join(content['hashtags'][:3])}")
        print(f"")
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ +{len(contents)-3} autres contenus disponibles !")
    print("")
    print("🎯 UTILISATION:")
    print("   1. Deviens affilié (inscription gratuite)")
    print("   2. Récupère ton code unique (ex: AFF-ABC123)")
    print("   3. Copie n'importe quel contenu des 100")
    print("   4. Remplace TON_CODE par ton code affilié")
    print("   5. Poste sur TikTok/Instagram/Facebook")
    print("   6. Touche 20% de commission sur chaque vente")
    print("")
    print(f"💰 POTENTIEL: 10 posts/jour × 5 ventes/semaine × 8€ commission = 160€/semaine")
    print("")
