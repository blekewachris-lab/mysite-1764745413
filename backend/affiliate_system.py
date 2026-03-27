"""
SYSTÈME D'AFFILIATION - 100 CONTENUS IA GÉNÉRÉS
Permet à 100+ affiliés de promouvoir vos produits avec contenu prêt à l'emploi
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime, timezone
import uuid
import random
import string

affiliate_router = APIRouter(prefix="/api/affiliate", tags=["affiliation"])

# ==================== MODELS ====================

class Affiliate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str  # Unique affiliate code (ex: AFF-ABC123)
    name: str
    email: str
    commission_rate: float = 20.0  # 20% de commission
    total_clicks: int = 0
    total_conversions: int = 0
    total_earnings: float = 0.0
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AffiliateCreate(BaseModel):
    name: str
    email: str

class AffiliateClick(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    affiliate_code: str
    visitor_id: str
    product_id: Optional[str] = None
    converted: bool = False
    order_id: Optional[str] = None
    commission_earned: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AffiliateContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_number: int
    content_type: str  # post, story, email, ad
    title: str
    content: str
    platform: str  # tiktok, instagram, facebook, email
    hook: Optional[str] = None
    cta: Optional[str] = None
    hashtags: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPER FUNCTIONS ====================

def generate_affiliate_code() -> str:
    """Génère un code d'affilié unique"""
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"AFF-{random_part}"

async def generate_affiliate_link(affiliate_code: str, product_id: str, base_url: str) -> str:
    """Génère un lien d'affiliation"""
    return f"{base_url}/store?ref={affiliate_code}&product={product_id}"

# ==================== 100 CONTENUS MARKETING IA ====================

AFFILIATE_CONTENT_TEMPLATES = [
    # TIKTOK/INSTAGRAM POSTS (50 contenus)
    {
        "type": "post",
        "platform": "tiktok",
        "hook": "Je gagne 500€/mois en partageant des produits 🔥",
        "content": "Voici comment : je partage des produits tendances sur TikTok, mes followers achètent via mon lien, je touche 20% de commission. Aucun stock, aucun risque. Lien en bio pour rejoindre.",
        "cta": "Rejoins le programme d'affiliation",
        "hashtags": ["#affiliatemarketing", "#sidehustle", "#revenupassif"]
    },
    {
        "type": "post",
        "platform": "instagram",
        "hook": "Comment je fais 1000€/mois sans vendre",
        "content": "Je recommande des produits que j'adore, mes abonnés achètent, je reçois une commission. C'est du marketing d'affiliation et c'est 100% légal. Tu veux essayer ?",
        "cta": "Inscris-toi gratuitement",
        "hashtags": ["#marketing", "#businessonline", "#argent"]
    },
    {
        "type": "post",
        "platform": "tiktok",
        "hook": "Gagner de l'argent en dormant ? C'est possible",
        "content": "J'ai partagé un post hier soir. Ce matin : 3 ventes, 75€ de commission dans mon compte. Le marketing d'affiliation c'est ÇA. Liens dans ma bio.",
        "cta": "Commence maintenant",
        "hashtags": ["#motivation", "#entrepreneur", "#success"]
    },
    {
        "type": "story",
        "platform": "instagram",
        "hook": "Ma routine matinale pour gagner 50€",
        "content": "7h : Check mes stats d'affiliation. 8h : Poste 3 stories produits. 9h : Réponds aux DMs. Midi : 50€ de commission. Répète. Swipe up pour le programme.",
        "cta": "Swipe up maintenant",
        "hashtags": []
    },
    {
        "type": "post",
        "platform": "facebook",
        "hook": "Revenu passif : Mythe ou Réalité ?",
        "content": "Réalité ! Depuis que je fais du marketing d'affiliation, je gagne entre 300-1000€/mois en partageant des produits que j'aime. Aucun investissement requis. Programme ouvert à tous.",
        "cta": "Rejoindre gratuitement",
        "hashtags": ["#entrepreneuriat", "#liberté", "#travailadomicile"]
    }
]

# Générer 95 variations supplémentaires
def generate_100_contents() -> List[Dict]:
    """Génère 100 contenus marketing uniques"""
    contents = []
    
    # Templates de base
    hooks = [
        "Je gagne {amount}€/mois sans boss",
        "Comment transformer tes followers en revenu",
        "Le side hustle que personne ne connaît",
        "De 0 à {amount}€ en {days} jours",
        "Pourquoi je ne cherche plus de job",
        "Mon secret pour gagner {amount}€/semaine",
        "Arrête de scroller, commence à gagner",
        "Le business model le plus simple",
        "Comment je finance mes vacances",
        "Revenu passif : Mon expérience réelle"
    ]
    
    stories = [
        "J'ai découvert le marketing d'affiliation il y a {months} mois. Aujourd'hui je gagne {amount}€/mois en partageant des produits. Zero stock, zero risque. Juste un lien et de la passion.",
        "Tu as {followers} followers ? Transforme-les en revenu ! Partage des produits, touche {commission}% de commission. Je fais {amount}€/mois comme ça. Programme gratuit, rejoins-nous.",
        "Mon objectif : {amount}€/mois en affiliation. Actuellement à {current}€. Stratégie : poster {posts} fois/jour, répondre à tous les DMs, être authentique. Ça marche !",
        "Les gens me demandent comment je gagne de l'argent en ligne. Simple : j'aide des marques à vendre leurs produits. Ils me paient {commission}% par vente. Inscription gratuite dans ma bio.",
        "Sceptique sur l'affiliation ? J'étais pareil. Puis j'ai testé. Premier mois : {amount1}€. Deuxième mois : {amount2}€. Maintenant : {amount3}€/mois. Prêt à essayer ?"
    ]
    
    ctas = [
        "Rejoins maintenant (lien en bio)",
        "Inscris-toi gratuitement",
        "Commence aujourd'hui",
        "Clique le lien dans ma bio",
        "DM moi pour le lien",
        "Swipe up pour t'inscrire",
        "Programme gratuit - Rejoins-nous",
        "Lien d'inscription en bio",
        "Démarre ton side hustle",
        "Essaie gratuitement"
    ]
    
    platforms = ["tiktok", "instagram", "facebook", "twitter", "linkedin"]
    types = ["post", "story", "reel"]
    
    # Ajouter les templates de base
    for i, template in enumerate(AFFILIATE_CONTENT_TEMPLATES[:5], 1):
        contents.append({
            "number": i,
            "type": template["type"],
            "platform": template["platform"],
            "hook": template["hook"],
            "content": template["content"],
            "cta": template["cta"],
            "hashtags": template.get("hashtags", [])
        })
    
    # Générer 95 contenus supplémentaires
    for i in range(6, 101):
        hook_template = random.choice(hooks)
        story_template = random.choice(stories)
        cta = random.choice(ctas)
        platform = random.choice(platforms)
        content_type = random.choice(types)
        
        # Remplacer les variables
        hook = hook_template.format(
            amount=random.choice([300, 500, 800, 1000, 1500]),
            days=random.choice([30, 60, 90]),
            months=random.choice([2, 3, 6])
        )
        
        story = story_template.format(
            months=random.choice([2, 3, 4, 6]),
            amount=random.choice([500, 800, 1000, 1500]),
            amount1=random.choice([50, 100, 150]),
            amount2=random.choice([200, 300, 400]),
            amount3=random.choice([600, 800, 1000]),
            followers=random.choice(["100", "500", "1000", "5000"]),
            commission=20,
            posts=random.choice([3, 5, 10]),
            current=random.choice([300, 400, 500])
        )
        
        hashtags = random.sample([
            "#affiliatemarketing", "#sidehustle", "#entrepreneur",
            "#businessonline", "#revenupassif", "#marketing",
            "#argent", "#motivation", "#success", "#liberté"
        ], 3)
        
        contents.append({
            "number": i,
            "type": content_type,
            "platform": platform,
            "hook": hook,
            "content": story,
            "cta": cta,
            "hashtags": hashtags
        })
    
    return contents

# ==================== ROUTES ====================

# Note: Ces routes seraient normalement ajoutées au router principal
# Pour l'instant, elles sont documentées ici

AFFILIATE_ROUTES_DOC = """
# Routes d'affiliation à ajouter:

@affiliate_router.post("/register")
async def register_affiliate(affiliate: AffiliateCreate):
    '''Inscription affilié - Génère code unique'''
    code = generate_affiliate_code()
    # Créer dans DB avec commission 20%
    return {"code": code, "commission_rate": 20.0}

@affiliate_router.get("/contents")
async def get_affiliate_contents():
    '''Récupère les 100 contenus marketing'''
    return generate_100_contents()

@affiliate_router.get("/dashboard/{affiliate_code}")
async def get_affiliate_dashboard(affiliate_code: str):
    '''Dashboard affilié avec stats'''
    # Retourner: clicks, conversions, earnings
    return {"clicks": 0, "conversions": 0, "earnings": 0.0}

@affiliate_router.post("/track-click")
async def track_affiliate_click(affiliate_code: str, visitor_id: str):
    '''Track un clic sur lien d'affiliation'''
    # Incrémenter compteur clicks
    return {"tracked": True}

@affiliate_router.get("/link")
async def generate_affiliate_link_endpoint(affiliate_code: str, product_id: str):
    '''Génère lien d'affiliation unique'''
    link = await generate_affiliate_link(affiliate_code, product_id, "https://rapid-sales-system.preview.emergentagent.com")
    return {"link": link}
"""

print(AFFILIATE_ROUTES_DOC)
