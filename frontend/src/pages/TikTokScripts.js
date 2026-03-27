import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Sparkle, Copy, Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TikTokScripts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && products.length > 0) {
      setSelectedProduct(productId);
      fetchScripts(productId);
    }
  }, [searchParams, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
    }
  };

  const fetchScripts = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tiktok-scripts/${productId}`);
      setScripts(res.data);
    } catch (error) {
      console.error("Erreur chargement scripts:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateScripts = async () => {
    if (!selectedProduct) {
      toast.error("Sélectionnez un produit");
      return;
    }

    setGenerating(true);
    try {
      await axios.post(`${API}/generate/tiktok-scripts`, {
        product_id: selectedProduct
      });
      toast.success("20 scripts TikTok générés !");
      fetchScripts(selectedProduct);
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const copyScript = (script, scriptId) => {
    navigator.clipboard.writeText(`${script.hook}\n\n${script.script}\n\n${script.cta}`);
    setCopiedId(scriptId);
    toast.success("Script copié !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportScripts = async () => {
    if (!selectedProduct || scripts.length === 0) {
      toast.error("Aucun script à exporter");
      return;
    }

    try {
      const res = await axios.get(`${API}/export/tiktok-scripts/${selectedProduct}?format=txt`);
      const blob = new Blob([res.data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Scripts exportés !");
    } catch (error) {
      console.error("Erreur export:", error);
      toast.error("Erreur d'export");
    }
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    fetchScripts(value);
  };

  return (
    <div className="flex" data-testid="tiktok-scripts-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            SCRIPTS TIKTOK VIRAUX
          </h1>
          <p className="text-base text-[#A1A1AA]">Générez 20 scripts ultra convertissants par produit</p>
        </div>

        <div className="metric-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
                Sélectionner un produit
              </p>
              <Select value={selectedProduct} onValueChange={handleProductChange}>
                <SelectTrigger 
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="product-selector"
                >
                  <SelectValue placeholder="Choisissez un produit" />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[#27272A]">
                  {products.map(product => (
                    <SelectItem 
                      key={product.id} 
                      value={product.id}
                      className="text-white hover:bg-[#1A1A1A]"
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={generateScripts}
                disabled={generating || !selectedProduct}
                className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
                style={{borderRadius: '2px'}}
                data-testid="generate-scripts-btn"
              >
                <Sparkle size={20} weight="bold" className="mr-2" />
                {generating ? "Génération..." : "Générer 20 scripts"}
              </Button>
              {scripts.length > 0 && (
                <Button
                  onClick={exportScripts}
                  className="bg-[#34C759] hover:bg-[#2ea34a] text-white font-bold uppercase tracking-wide"
                  style={{borderRadius: '2px'}}
                  data-testid="export-scripts-btn"
                >
                  <Copy size={20} weight="bold" className="mr-2" />
                  Exporter TXT
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : scripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map((script, index) => (
              <div 
                key={script.id} 
                className="script-card"
                data-testid={`script-card-${index}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#007AFF] flex items-center justify-center font-black" style={{borderRadius: '2px', fontFamily: 'Barlow Condensed'}}>
                      {index + 1}
                    </div>
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                      SCRIPT VIRAL
                    </p>
                  </div>
                  <button
                    onClick={() => copyScript(script, script.id)}
                    className="text-[#007AFF] hover:text-white transition-colors"
                    data-testid={`copy-script-btn-${index}`}
                  >
                    {copiedId === script.id ? (
                      <Check size={20} weight="bold" className="text-[#34C759]" />
                    ) : (
                      <Copy size={20} weight="bold" />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#FF3B30] uppercase tracking-wide font-bold mb-1">
                      🔥 HOOK
                    </p>
                    <p className="text-white font-semibold">{script.hook}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#007AFF] uppercase tracking-wide font-bold mb-1">
                      🎬 SCRIPT
                    </p>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed">{script.script}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#34C759] uppercase tracking-wide font-bold mb-1">
                      ➡️ CTA
                    </p>
                    <p className="text-white font-semibold">{script.cta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="metric-card p-12 text-center">
            <Sparkle size={48} weight="bold" className="text-[#007AFF] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#A1A1AA] mb-2">
              Aucun script généré
            </p>
            <p className="text-sm text-[#71717A]">
              Sélectionnez un produit et cliquez sur "Générer 20 scripts"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokScripts;