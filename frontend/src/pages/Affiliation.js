import { useState, useEffect } from "react";
import { Users, Link as LinkIcon, TrendUp, Copy, Check, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Affiliation = () => {
  const [affiliateCode, setAffiliateCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [contents, setContents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadContents();
    // Check if already registered
    const saved = localStorage.getItem("affiliate_code");
    if (saved) {
      setAffiliateCode(saved);
      setIsRegistered(true);
    }
  }, []);

  const loadContents = async () => {
    try {
      const response = await fetch("/data/affiliate_contents_100.json");
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error loading contents:", error);
    }
  };

  const generateAffiliateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "AFF-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRegister = () => {
    if (!name || !email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const code = generateAffiliateCode();
    setAffiliateCode(code);
    setIsRegistered(true);
    localStorage.setItem("affiliate_code", code);
    localStorage.setItem("affiliate_name", name);
    localStorage.setItem("affiliate_email", email);
    
    toast.success("Inscription réussie ! Votre code : " + code);
  };

  const copyContent = (content) => {
    const fullContent = `${content.hook}

${content.contenu}

${content.cta}

${content.hashtags.join(" ")}

🔗 ${content.lien.replace("TON_CODE", affiliateCode)}

---
Commission : ${content.commission} sur chaque vente
Code affilié : ${affiliateCode}`;

    navigator.clipboard.writeText(fullContent);
    setCopiedId(content.id);
    toast.success("Contenu copié avec votre lien d'affiliation !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyLink = (productId = "all") => {
    const link = `https://rapid-sales-system.preview.emergentagent.com/store?ref=${affiliateCode}${productId !== "all" ? `&product=${productId}` : ""}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié !");
  };

  const filteredContents = contents.filter(c => {
    if (filter === "all") return true;
    return c.platform === filter;
  });

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-8 flex items-center justify-center" data-testid="affiliation-register">
        <div className="max-w-4xl w-full">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#007AFF]/10 px-4 py-2 mb-6" style={{borderRadius: '20px'}}>
              <Sparkle size={20} weight="fill" className="text-[#007AFF]" />
              <span className="text-[#007AFF] font-bold text-sm uppercase tracking-wide">Programme d'affiliation</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
              GAGNE 20% DE COMMISSION
            </h1>
            <p className="text-xl text-[#A1A1AA] max-w-2xl mx-auto">
              Inscris-toi gratuitement, reçois <span className="text-[#34C759] font-bold">100 contenus marketing prêts à l'emploi</span>, et commence à gagner de l'argent en partageant des produits.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-[#111111] border border-[#27272A] p-6 text-center" style={{borderRadius: '4px'}}>
              <p className="text-4xl font-black text-[#34C759] mb-2" style={{fontFamily: 'Barlow Condensed'}}>20%</p>
              <p className="text-sm text-[#71717A] uppercase tracking-wide">Commission garantie</p>
            </div>
            <div className="bg-[#111111] border border-[#27272A] p-6 text-center" style={{borderRadius: '4px'}}>
              <p className="text-4xl font-black text-[#007AFF] mb-2" style={{fontFamily: 'Barlow Condensed'}}>100</p>
              <p className="text-sm text-[#71717A] uppercase tracking-wide">Contenus prêts</p>
            </div>
            <div className="bg-[#111111] border border-[#27272A] p-6 text-center" style={{borderRadius: '4px'}}>
              <p className="text-4xl font-black text-[#FF9500] mb-2" style={{fontFamily: 'Barlow Condensed'}}>0€</p>
              <p className="text-sm text-[#71717A] uppercase tracking-wide">Frais d'inscription</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#111111] border border-[#27272A] p-8" style={{borderRadius: '4px'}}>
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-6 text-center" style={{fontFamily: 'Barlow Condensed'}}>
              INSCRIPTION GRATUITE
            </h2>
            
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Ton nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0A0A0A] border-[#27272A] text-white text-lg p-6"
                data-testid="affiliate-name"
              />
              <Input
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0A0A0A] border-[#27272A] text-white text-lg p-6"
                data-testid="affiliate-email"
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full bg-[#34C759] hover:bg-[#2ea34a] text-white font-black uppercase text-lg py-6"
              style={{borderRadius: '4px'}}
              data-testid="register-affiliate-btn"
            >
              <Sparkle size={24} weight="fill" className="mr-2" />
              DEVENIR AFFILIÉ MAINTENANT
            </Button>

            <p className="text-center text-xs text-[#71717A] mt-4">
              En t'inscrivant, tu acceptes de promouvoir nos produits de manière éthique.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
              <h3 className="text-xl font-bold tracking-tight uppercase mb-3" style={{fontFamily: 'Barlow Condensed'}}>
                ✅ CE QUE TU REÇOIS
              </h3>
              <ul className="space-y-2 text-[#A1A1AA]">
                <li>• Code d'affiliation unique</li>
                <li>• 100 posts marketing IA</li>
                <li>• Liens trackés automatiquement</li>
                <li>• Dashboard de suivi</li>
                <li>• Paiement commission garanti</li>
              </ul>
            </div>

            <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
              <h3 className="text-xl font-bold tracking-tight uppercase mb-3" style={{fontFamily: 'Barlow Condensed'}}>
                💰 POTENTIEL DE GAINS
              </h3>
              <ul className="space-y-2 text-[#A1A1AA]">
                <li>• 5 ventes/semaine × 8€ = <span className="text-[#34C759] font-bold">160€/mois</span></li>
                <li>• 10 ventes/semaine × 8€ = <span className="text-[#34C759] font-bold">320€/mois</span></li>
                <li>• 20 ventes/semaine × 8€ = <span className="text-[#34C759] font-bold">640€/mois</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-8" data-testid="affiliation-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            PROGRAMME D'AFFILIATION
          </h1>
          <p className="text-base text-[#A1A1AA]">Ton code: <span className="text-[#34C759] font-bold">{affiliateCode}</span></p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} weight="bold" className="text-[#007AFF]" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">Ton Code</p>
            </div>
            <p className="text-2xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>{affiliateCode}</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon size={20} weight="bold" className="text-[#34C759]" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">Contenus</p>
            </div>
            <p className="text-2xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>100</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
            <div className="flex items-center gap-2 mb-2">
              <TrendUp size={20} weight="bold" className="text-[#FF9500]" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">Commission</p>
            </div>
            <p className="text-2xl font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>20%</p>
          </div>

          <div className="bg-[#111111] border border-[#27272A] p-6" style={{borderRadius: '4px'}}>
            <Button
              onClick={() => copyLink()}
              className="w-full bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase"
              style={{borderRadius: '2px'}}
              data-testid="copy-affiliate-link"
            >
              <Copy size={16} weight="bold" className="mr-2" />
              Copier mon lien
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111111] border border-[#27272A] p-4 mb-6" style={{borderRadius: '4px'}}>
          <div className="flex flex-wrap gap-2">
            {["all", "tiktok", "instagram", "facebook", "twitter", "youtube"].map(platform => (
              <button
                key={platform}
                onClick={() => setFilter(platform)}
                className={`px-4 py-2 font-bold uppercase text-sm transition-colors ${
                  filter === platform
                    ? "bg-[#007AFF] text-white"
                    : "bg-[#0A0A0A] text-[#71717A] hover:text-white"
                }`}
                style={{borderRadius: '2px'}}
                data-testid={`filter-${platform}`}
              >
                {platform === "all" ? "Tous" : platform}
              </button>
            ))}
          </div>
        </div>

        {/* Contents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.slice(0, 30).map((content) => (
            <div key={content.id} className="bg-[#111111] border border-[#27272A] p-4" style={{borderRadius: '4px'}} data-testid={`content-${content.id}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#007AFF]">{content.numero}</span>
                <span className="text-xs font-bold text-[#71717A] uppercase">{content.platform}</span>
              </div>
              
              <p className="text-white font-bold mb-2 line-clamp-2">{content.hook}</p>
              <p className="text-sm text-[#A1A1AA] mb-3 line-clamp-3">{content.contenu}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {content.hashtags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs text-[#007AFF]">{tag}</span>
                ))}
              </div>

              <Button
                onClick={() => copyContent(content)}
                className="w-full bg-[#34C759] hover:bg-[#2ea34a] text-white font-bold uppercase text-xs"
                style={{borderRadius: '2px'}}
                data-testid={`copy-content-${content.id}`}
              >
                {copiedId === content.id ? (
                  <><Check size={16} weight="bold" className="mr-1" /> Copié !</>
                ) : (
                  <><Copy size={16} weight="bold" className="mr-1" /> Copier avec mon lien</>
                )}
              </Button>
            </div>
          ))}
        </div>

        {filteredContents.length > 30 && (
          <div className="mt-8 text-center">
            <p className="text-[#A1A1AA]">+{filteredContents.length - 30} autres contenus disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Affiliation;
