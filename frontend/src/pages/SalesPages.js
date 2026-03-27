import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SalesPages = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [salesPage, setSalesPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
    }
  };

  const fetchSalesPage = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/sales-pages/${productId}`);
      setSalesPage(res.data);
    } catch (error) {
      setSalesPage(null);
    } finally {
      setLoading(false);
    }
  };

  const generateSalesPage = async () => {
    if (!selectedProduct) {
      toast.error("Sélectionnez un produit");
      return;
    }

    setGenerating(true);
    try {
      const res = await axios.post(`${API}/generate/sales-page`, {
        product_id: selectedProduct
      });
      setSalesPage(res.data);
      toast.success("Page de vente générée !");
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    fetchSalesPage(value);
  };

  return (
    <div className="flex" data-testid="sales-pages">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            PAGES DE VENTE
          </h1>
          <p className="text-base text-[#A1A1AA]">Générez des pages ultra convertissantes</p>
        </div>

        <div className="metric-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
                Sélectionner un produit
              </p>
              <Select value={selectedProduct} onValueChange={handleProductChange}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white" data-testid="select-product">
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
            <div className="flex items-end">
              <Button
                onClick={generateSalesPage}
                disabled={generating || !selectedProduct}
                className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
                style={{borderRadius: '2px'}}
                data-testid="generate-sales-page-btn"
              >
                <Sparkle size={20} weight="bold" className="mr-2" />
                {generating ? "Génération..." : "Générer la page"}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : salesPage ? (
          <div className="space-y-6">
            <div className="metric-card p-6" data-testid="sales-page-preview">
              <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                APERÇU DE LA PAGE
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                    TITRE
                  </p>
                  <h3 className="text-3xl font-black tracking-tight uppercase text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
                    {salesPage.titre}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                    PROMESSE
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {salesPage.promesse}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                    BÉNÉFICES
                  </p>
                  <ul className="space-y-2">
                    {salesPage.benefices.map((benefice, index) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <span className="text-[#34C759] font-bold">✓</span>
                        <span>{benefice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                    OFFRE
                  </p>
                  <div className="bg-[#007AFF] p-4" style={{borderRadius: '2px'}}>
                    <p className="text-2xl font-black text-white" style={{fontFamily: 'Barlow Condensed'}}>
                      {salesPage.offre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-card p-6">
              <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                CODE HTML
              </h2>
              <div className="bg-[#0A0A0A] p-4 overflow-x-auto" style={{borderRadius: '2px'}}>
                <pre className="text-[#34C759] text-sm font-mono">
                  {salesPage.html_content}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-card p-12 text-center">
            <Sparkle size={48} weight="bold" className="text-[#007AFF] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#A1A1AA] mb-2">
              Aucune page générée
            </p>
            <p className="text-sm text-[#71717A]">
              Sélectionnez un produit et cliquez sur "Générer la page"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPages;