from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# ==================== MODELS ====================

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    prix_achat: float
    prix_vente: float
    image_url: str
    description: str
    cible: str
    angle_marketing: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    prix_achat: float
    prix_vente: float
    image_url: str
    description: str
    cible: str
    angle_marketing: str

class TikTokScript(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    product_name: str
    script: str
    hook: str
    cta: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DMScript(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    variation_number: int
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SalesPage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    product_name: str
    titre: str
    promesse: str
    benefices: List[str]
    offre: str
    html_content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Analytics(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    ca_journalier: float
    nb_ventes: int
    objectif: float = 1000.0
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    amount: float
    currency: str
    payment_status: str
    metadata: Optional[Dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GenerateRequest(BaseModel):
    product_id: str

class CheckoutRequest(BaseModel):
    package_id: str
    origin_url: str

# ==================== HELPER FUNCTIONS ====================

async def generate_with_llm(prompt: str) -> str:
    """Generate content using OpenAI GPT-5.2"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"ecommerce-{uuid.uuid4()}",
            system_message="Tu es un expert en e-commerce viral et en marketing agressif. Tu crées du contenu ultra convertissant pour TikTok/Instagram."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logging.error(f"LLM generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur génération: {str(e)}")

# ==================== PRODUCTS ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "E-commerce Automation API"}

@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(100)
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    return products

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé"}

# ==================== GENERATION ROUTES ====================

@api_router.post("/generate/tiktok-scripts")
async def generate_tiktok_scripts(request: GenerateRequest):
    # Get product
    product = await db.products.find_one({"id": request.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Delete existing scripts for this product
    await db.tiktok_scripts.delete_many({"product_id": request.product_id})
    
    prompt = f"""Génère 20 scripts TikTok viraux pour ce produit e-commerce :

Produit: {product['name']}
Description: {product['description']}
Cible: {product['cible']}
Angle marketing: {product['angle_marketing']}
Prix: {product['prix_vente']}€

Pour chaque script (numéroté de 1 à 20):
- Hook ultra accrocheur (2 premières secondes)
- Script court (15-30 secondes max)
- CTA direct et agressif

Format:
SCRIPT 1:
HOOK: [hook puissant]
SCRIPT: [contenu du script]
CTA: [call to action]
---

Génère les 20 scripts maintenant."""
    
    response = await generate_with_llm(prompt)
    
    # Parse response and create scripts
    scripts = []
    script_blocks = response.split('---')
    
    for i, block in enumerate(script_blocks[:20], 1):
        if 'HOOK:' in block and 'SCRIPT:' in block and 'CTA:' in block:
            lines = block.strip().split('\n')
            hook = ''
            script = ''
            cta = ''
            
            for line in lines:
                if line.startswith('HOOK:'):
                    hook = line.replace('HOOK:', '').strip()
                elif line.startswith('SCRIPT:'):
                    script = line.replace('SCRIPT:', '').strip()
                elif line.startswith('CTA:'):
                    cta = line.replace('CTA:', '').strip()
            
            script_obj = TikTokScript(
                product_id=request.product_id,
                product_name=product['name'],
                script=script or block.strip(),
                hook=hook or "Hook viral",
                cta=cta or "Lien en bio !"
            )
            
            doc = script_obj.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.tiktok_scripts.insert_one(doc)
            scripts.append(script_obj)
    
    return {"message": f"{len(scripts)} scripts TikTok générés", "count": len(scripts)}

@api_router.get("/tiktok-scripts/{product_id}", response_model=List[TikTokScript])
async def get_tiktok_scripts(product_id: str):
    scripts = await db.tiktok_scripts.find({"product_id": product_id}, {"_id": 0}).to_list(100)
    for script in scripts:
        if isinstance(script.get('created_at'), str):
            script['created_at'] = datetime.fromisoformat(script['created_at'])
    return scripts

@api_router.post("/generate/dm-scripts")
async def generate_dm_scripts():
    # Delete existing DM scripts
    await db.dm_scripts.delete_many({})
    
    prompt = """Génère 5 messages de closing ultra efficaces pour vendre en DM Instagram/TikTok.

Chaque message doit être:
- Court (2-3 phrases max)
- Direct et agressif
- Orienté conversion immédiate
- Avec urgence ou rareté

Format:
MESSAGE 1:
[contenu du message]
---

Génère les 5 messages maintenant."""
    
    response = await generate_with_llm(prompt)
    
    # Parse and create DM scripts
    scripts = []
    message_blocks = response.split('---')
    
    for i, block in enumerate(message_blocks[:5], 1):
        message = block.replace(f'MESSAGE {i}:', '').strip()
        if message:
            script_obj = DMScript(
                variation_number=i,
                message=message
            )
            doc = script_obj.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.dm_scripts.insert_one(doc)
            scripts.append(script_obj)
    
    return {"message": f"{len(scripts)} messages DM générés", "count": len(scripts)}

@api_router.get("/dm-scripts", response_model=List[DMScript])
async def get_dm_scripts():
    scripts = await db.dm_scripts.find({}, {"_id": 0}).to_list(100)
    for script in scripts:
        if isinstance(script.get('created_at'), str):
            script['created_at'] = datetime.fromisoformat(script['created_at'])
    return scripts

@api_router.post("/generate/sales-page")
async def generate_sales_page(request: GenerateRequest):
    product = await db.products.find_one({"id": request.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    # Delete existing sales page for this product
    await db.sales_pages.delete_many({"product_id": request.product_id})
    
    prompt = f"""Crée une page de vente ultra convertissante pour:

Produit: {product['name']}
Description: {product['description']}
Cible: {product['cible']}
Prix: {product['prix_vente']}€

Fournis:
1. Un titre accrocheur (1 ligne)
2. Une promesse forte (1 phrase)
3. 3 bénéfices clients clés (bullet points)
4. Une offre avec urgence (promo/rareté)
5. Du contenu HTML simple pour la page complète

Format:
TITRE: [titre]
PROMESSE: [promesse]
BÉNÉFICES:
- [bénéfice 1]
- [bénéfice 2]
- [bénéfice 3]
OFFRE: [offre avec urgence]
HTML:
[code html complet de la page]"""
    
    response = await generate_with_llm(prompt)
    
    # Parse response
    lines = response.split('\n')
    titre = ""
    promesse = ""
    benefices = []
    offre = ""
    html_content = ""
    
    in_html = False
    for line in lines:
        if line.startswith('TITRE:'):
            titre = line.replace('TITRE:', '').strip()
        elif line.startswith('PROMESSE:'):
            promesse = line.replace('PROMESSE:', '').strip()
        elif line.startswith('- '):
            benefices.append(line.replace('- ', '').strip())
        elif line.startswith('OFFRE:'):
            offre = line.replace('OFFRE:', '').strip()
        elif 'HTML:' in line:
            in_html = True
        elif in_html:
            html_content += line + '\n'
    
    sales_page = SalesPage(
        product_id=request.product_id,
        product_name=product['name'],
        titre=titre or f"Découvrez {product['name']}",
        promesse=promesse or "Le produit qui va changer votre quotidien",
        benefices=benefices if benefices else ["Bénéfice 1", "Bénéfice 2", "Bénéfice 3"],
        offre=offre or f"Seulement {product['prix_vente']}€ - Stock limité !",
        html_content=html_content or "<h1>Page en cours de génération</h1>"
    )
    
    doc = sales_page.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sales_pages.insert_one(doc)
    
    return sales_page

@api_router.get("/sales-pages/{product_id}", response_model=SalesPage)
async def get_sales_page(product_id: str):
    page = await db.sales_pages.find_one({"product_id": product_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page de vente non trouvée")
    if isinstance(page.get('created_at'), str):
        page['created_at'] = datetime.fromisoformat(page['created_at'])
    return page

# ==================== ANALYTICS ROUTES ====================

@api_router.get("/analytics/today", response_model=Analytics)
async def get_today_analytics():
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    analytics = await db.analytics.find_one({"date": today}, {"_id": 0})
    
    if not analytics:
        # Create default analytics for today
        analytics_obj = Analytics(
            date=today,
            ca_journalier=0.0,
            nb_ventes=0,
            objectif=1000.0
        )
        doc = analytics_obj.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.analytics.insert_one(doc)
        return analytics_obj
    
    if isinstance(analytics.get('updated_at'), str):
        analytics['updated_at'] = datetime.fromisoformat(analytics['updated_at'])
    return analytics

@api_router.get("/analytics/history")
async def get_analytics_history():
    analytics = await db.analytics.find({}, {"_id": 0}).sort("date", -1).to_list(30)
    for item in analytics:
        if isinstance(item.get('updated_at'), str):
            item['updated_at'] = datetime.fromisoformat(item['updated_at'])
    return analytics

# ==================== PAYMENT ROUTES ====================

PACKAGES = {
    "starter": 29.0,
    "pro": 49.0,
    "elite": 99.0
}

@api_router.post("/checkout/session", response_model=CheckoutSessionResponse)
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    if request.package_id not in PACKAGES:
        raise HTTPException(status_code=400, detail="Package invalide")
    
    amount = PACKAGES[request.package_id]
    
    # Build URLs from origin
    success_url = f"{request.origin_url}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/"
    
    # Initialize Stripe
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(
        api_key=os.environ.get('STRIPE_API_KEY'),
        webhook_url=webhook_url
    )
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "package_id": request.package_id,
            "source": "ecommerce_automation"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        session_id=session.session_id,
        amount=amount,
        currency="eur",
        payment_status="pending",
        metadata={"package_id": request.package_id}
    )
    
    doc = transaction.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.payment_transactions.insert_one(doc)
    
    return session

@api_router.get("/checkout/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_checkout_status(session_id: str, http_request: Request):
    # Initialize Stripe
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(
        api_key=os.environ.get('STRIPE_API_KEY'),
        webhook_url=webhook_url
    )
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction in database
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    
    if transaction and transaction['payment_status'] != status.payment_status:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": status.payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # If payment successful, update analytics
        if status.payment_status == "paid":
            today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
            analytics = await db.analytics.find_one({"date": today})
            
            if analytics:
                new_ca = analytics['ca_journalier'] + (status.amount_total / 100.0)
                new_ventes = analytics['nb_ventes'] + 1
                await db.analytics.update_one(
                    {"date": today},
                    {
                        "$set": {
                            "ca_journalier": new_ca,
                            "nb_ventes": new_ventes,
                            "updated_at": datetime.now(timezone.utc).isoformat()
                        }
                    }
                )
            else:
                analytics_obj = Analytics(
                    date=today,
                    ca_journalier=status.amount_total / 100.0,
                    nb_ventes=1
                )
                doc = analytics_obj.model_dump()
                doc['updated_at'] = doc['updated_at'].isoformat()
                await db.analytics.insert_one(doc)
    
    return status

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(
        api_key=os.environ.get('STRIPE_API_KEY'),
        webhook_url=webhook_url
    )
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        return {"status": "success", "event": webhook_response.event_type}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== STRATEGY ROUTES ====================

@api_router.get("/strategy")
async def get_strategy():
    return {
        "multi_comptes": {
            "titre": "Stratégie Multi-Comptes",
            "description": "Comment poster 20 à 50 vidéos par jour sans blocage",
            "points": [
                "Créer 5-10 comptes TikTok/Instagram",
                "Utiliser des proxies différents pour chaque compte",
                "Poster 2-5 vidéos par compte par jour",
                "Varier les heures de publication",
                "Recycler le contenu viral avec des variations"
            ]
        },
        "trafic_gratuit": {
            "titre": "Trafic Gratuit Massif",
            "hashtags": ["#tiktokmademebuyit", "#amazonfinds", "#musthave", "#viral", "#foryou"],
            "tactiques": [
                "Hook ultra fort dans les 2 premières secondes",
                "Vidéos courtes (15-30 secondes max)",
                "CTA clair dans chaque vidéo",
                "Poster aux heures de pointe (12h, 18h, 21h)",
                "Analyser et dupliquer ce qui fonctionne"
            ]
        },
        "scale": {
            "titre": "Plan de Scale 100€ → 1000€/jour",
            "etapes": [
                "0-100€/jour: Trafic 100% organique, teste les produits",
                "100-300€/jour: Identifie les produits gagnants, augmente la cadence de posts",
                "300-500€/jour: Lance publicités avec budget 50€/jour sur meilleurs produits",
                "500-1000€/jour: Scale publicités à 200€/jour, optimise tunnel de vente",
                "1000€+/jour: Automatise maximum, recrute VA pour gestion contenu"
            ],
            "budget_pub": {
                "phase1": "0€ (organique uniquement)",
                "phase2": "50€/jour",
                "phase3": "200€/jour",
                "phase4": "500€+/jour"
            }
        }
    }

@api_router.get("/action-plan")
async def get_action_plan():
    return {
        "plan_7_jours": [
            {
                "jour": 1,
                "titre": "Setup & Fondations",
                "actions": [
                    "Sélectionner 5 produits gagnants",
                    "Créer 5 comptes TikTok/Instagram",
                    "Générer 20 scripts TikTok par produit",
                    "Setup tunnel de vente Systeme.io"
                ],
                "objectif": "Première vente"
            },
            {
                "jour": 2,
                "titre": "Production Contenu",
                "actions": [
                    "Filmer/sourcer 30 vidéos (6 par produit)",
                    "Éditer avec hooks viraux",
                    "Planifier posts pour 3 jours",
                    "Tester 3 produits prioritaires"
                ],
                "objectif": "5-10 ventes"
            },
            {
                "jour": 3,
                "titre": "Optimisation",
                "actions": [
                    "Analyser métriques (vues, engagement, conversions)",
                    "Identifier top 2 produits gagnants",
                    "Générer 20 nouveaux scripts pour top produits",
                    "Augmenter cadence: 20 posts/jour"
                ],
                "objectif": "50€ CA"
            },
            {
                "jour": 4,
                "titre": "Scale Organique",
                "actions": [
                    "Poster 30-40 vidéos sur top produits",
                    "Répondre DMs avec scripts closing",
                    "Recycler contenu viral avec variations",
                    "Optimiser pages de vente"
                ],
                "objectif": "100€ CA"
            },
            {
                "jour": 5,
                "titre": "Introduction Publicités",
                "actions": [
                    "Lancer 3 campagnes pub (50€ total)",
                    "Tester audiences différentes",
                    "Continuer trafic organique massif",
                    "Tracker ROI par source"
                ],
                "objectif": "200€ CA"
            },
            {
                "jour": 6,
                "titre": "Optimisation Publicités",
                "actions": [
                    "Couper pubs non rentables",
                    "Scale pubs gagnantes à 100€/jour",
                    "Créer 10 nouvelles créatives",
                    "Automatiser réponses clients"
                ],
                "objectif": "400€ CA"
            },
            {
                "jour": 7,
                "titre": "Scale Agressif",
                "actions": [
                    "Budget pub à 200€/jour",
                    "50+ posts organiques/jour",
                    "Recruter VA pour gestion contenu",
                    "Optimiser tunnel pour upsells"
                ],
                "objectif": "700-1000€ CA"
            }
        ]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()