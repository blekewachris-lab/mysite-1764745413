import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [customerData, setCustomerData] = useState({ name: "", email: "", quantity: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (product) => {
    setCheckoutProduct(product);
  };

  const handleCheckout = async () => {
    if (!customerData.email || !customerData.name) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await axios.post(`${API}/store/checkout`, {
        product_id: checkoutProduct.id,
        quantity: parseInt(customerData.quantity),
        customer_email: customerData.email,
        customer_name: customerData.name
      });

      window.location.href = res.data.checkout_url;
    } catch (error) {
      console.error("Erreur checkout:", error);
      toast.error("Erreur lors du paiement");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-8" data-testid="store-page">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              BOUTIQUE
            </h1>
            <p className="text-base text-[#A1A1AA]">Produits tendances à prix cassés</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase"
            style={{borderRadius: '2px'}}
            data-testid="admin-btn"
          >
            Admin
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-testid="checkout-modal">
          <div className="bg-[#111111] border border-[#27272A] p-6 max-w-md w-full" style={{borderRadius: '4px'}}>
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
              FINALISER L'ACHAT
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-[#71717A] uppercase tracking-wide mb-1">Produit</p>
              <p className="text-white font-bold">{checkoutProduct.name}</p>
              <p className="text-[#34C759] text-2xl font-black mt-1" style={{fontFamily: 'Barlow Condensed'}}>
                {checkoutProduct.prix_vente}€
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] block mb-2">
                  Votre Nom
                </label>
                <Input
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  placeholder="Jean Dupont"
                  data-testid="customer-name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] block mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  placeholder="email@exemple.com"
                  data-testid="customer-email"
                />
              </div>
              <div>
                <label className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] block mb-2">
                  Quantité
                </label>
                <Input
                  type="number"
                  min="1"
                  value={customerData.quantity}
                  onChange={(e) => setCustomerData({...customerData, quantity: e.target.value})}
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="quantity"
                />
              </div>
            </div>

            <div className="mb-6 bg-[#0A0A0A] p-4" style={{borderRadius: '2px'}}>
              <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Total</p>
              <p className="text-3xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
                {(checkoutProduct.prix_vente * customerData.quantity).toFixed(2)}€
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCheckoutProduct(null)}
                variant="outline"
                className="flex-1 border-[#27272A] text-white hover:bg-[#1A1A1A]"
                style={{borderRadius: '2px'}}
                data-testid="cancel-checkout-btn"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-[#34C759] hover:bg-[#2ea34a] text-white font-bold uppercase"
                style={{borderRadius: '2px'}}
                data-testid="proceed-checkout-btn"
              >
                Payer maintenant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-[#111111] border border-[#27272A] overflow-hidden hover:border-[#007AFF] transition-colors" style={{borderRadius: '4px'}} data-testid={`store-product-${product.id}`}>
                <div className="aspect-video overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold tracking-tight uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide">Prix</p>
                      <p className="text-3xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                        {product.prix_vente}€
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#71717A] uppercase tracking-wide">Économie</p>
                      <p className="text-lg font-bold text-[#FF9500]">
                        {((1 - product.prix_vente / (product.prix_vente * 1.5)) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBuyNow(product)}
                    className="w-full bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase text-base py-6"
                    style={{borderRadius: '2px'}}
                    data-testid={`buy-btn-${product.id}`}
                  >
                    <ShoppingCart size={20} weight="bold" className="mr-2" />
                    ACHETER MAINTENANT
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#27272A] p-4 text-center" style={{borderRadius: '4px'}}>
          <p className="text-[#34C759] font-bold text-lg">✓ PAIEMENT SÉCURISÉ</p>
          <p className="text-[#71717A] text-sm">Stripe · Cartes · Crypto</p>
        </div>
        <div className="bg-[#111111] border border-[#27272A] p-4 text-center" style={{borderRadius: '4px'}}>
          <p className="text-[#34C759] font-bold text-lg">✓ LIVRAISON RAPIDE</p>
          <p className="text-[#71717A] text-sm">Expédition sous 24-48h</p>
        </div>
        <div className="bg-[#111111] border border-[#27272A] p-4 text-center" style={{borderRadius: '4px'}}>
          <p className="text-[#34C759] font-bold text-lg">✓ GARANTIE 30 JOURS</p>
          <p className="text-[#71717A] text-sm">Satisfait ou remboursé</p>
        </div>
      </div>
    </div>
  );
};

export default Store;