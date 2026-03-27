import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Sparkle, Copy, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DMScripts = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const res = await axios.get(`${API}/dm-scripts`);
      setScripts(res.data);
    } catch (error) {
      console.error("Erreur chargement scripts DM:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateScripts = async () => {
    setGenerating(true);
    try {
      await axios.post(`${API}/generate/dm-scripts`);
      toast.success("5 messages DM générés !");
      fetchScripts();
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const copyMessage = (message, scriptId) => {
    navigator.clipboard.writeText(message);
    setCopiedId(scriptId);
    toast.success("Message copié !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportScripts = async () => {
    if (scripts.length === 0) {
      toast.error("Aucun script à exporter");
      return;
    }

    try {
      const res = await axios.get(`${API}/export/dm-scripts?format=txt`);
      const blob = new Blob([res.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Messages exportés !");
    } catch (error) {
      console.error("Erreur export:", error);
      toast.error("Erreur d'export");
    }
  };

  return (
    <div className="flex" data-testid="dm-scripts-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            MESSAGES DM CLOSING
          </h1>
          <p className="text-base text-[#A1A1AA]">5 variations ultra efficaces pour convertir en DM</p>
        </div>

        <div className="metric-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={generateScripts}
              disabled={generating}
              className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
              style={{borderRadius: '2px'}}
              data-testid="generate-dm-scripts-btn"
            >
              <Sparkle size={20} weight="bold" className="mr-2" />
              {generating ? "Génération..." : "Générer 5 messages"}
            </Button>
            {scripts.length > 0 && (
              <Button
                onClick={exportScripts}
                className="bg-[#34C759] hover:bg-[#2ea34a] text-white font-bold uppercase tracking-wide"
                style={{borderRadius: '2px'}}
                data-testid="export-dm-scripts-btn"
              >
                <Copy size={20} weight="bold" className="mr-2" />
                Exporter TXT
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : scripts.length > 0 ? (
          <div className="space-y-4">
            {scripts.map((script) => (
              <div 
                key={script.id} 
                className="script-card"
                data-testid={`dm-script-${script.variation_number}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#007AFF] flex items-center justify-center text-xl font-black" style={{borderRadius: '2px', fontFamily: 'Barlow Condensed'}}>
                      {script.variation_number}
                    </div>
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                      VARIATION {script.variation_number}
                    </p>
                  </div>
                  <button
                    onClick={() => copyMessage(script.message, script.id)}
                    className="text-[#007AFF] hover:text-white transition-colors"
                    data-testid={`copy-dm-btn-${script.variation_number}`}
                  >
                    {copiedId === script.id ? (
                      <Check size={20} weight="bold" className="text-[#34C759]" />
                    ) : (
                      <Copy size={20} weight="bold" />
                    )}
                  </button>
                </div>

                <p className="text-white leading-relaxed text-base">{script.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="metric-card p-12 text-center">
            <Sparkle size={48} weight="bold" className="text-[#007AFF] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#A1A1AA] mb-2">
              Aucun message généré
            </p>
            <p className="text-sm text-[#71717A]">
              Cliquez sur "Générer 5 messages" pour créer vos scripts de closing
            </p>
          </div>
        )}

        <div className="metric-card p-6 mt-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
            CONSEILS CLOSING DM
          </h2>
          <ul className="space-y-2 text-[#A1A1AA]">
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] font-bold">•</span>
              <span>Répondre dans les 5 minutes maximum après un commentaire</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] font-bold">•</span>
              <span>Personnaliser avec le prénom si possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] font-bold">•</span>
              <span>Créer l'urgence (stock limité, promo temporaire)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] font-bold">•</span>
              <span>Envoyer le lien de paiement direct</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#007AFF] font-bold">•</span>
              <span>Follow-up après 1h si pas de réponse</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DMScripts;