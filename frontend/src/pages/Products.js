import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Plus, Trash, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DEFAULT_PRODUCTS = [
  {
    name: "Galaxy Projector Light",
    prix_achat: 12.0,
    prix_vente: 39.0,
    image_url: "https://images.unsplash.com/photo-1595565302791-ec72c034cf5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxnYWxheHklMjBwcm9qZWN0b3IlMjBsaWdodHxlbnwwfHx8fDE3NzQ2MDk4MTR8MA&ixlib=rb-4.1.0&q=85",
    description: "Projecteur galaxie LED avec rotation à 360°",
    cible: "18-35 ans, passionnés de déco/ambiance",
    angle_marketing: "Transformez votre chambre en galaxie"
  },
  {
    name: "Wireless Earbuds Pro",
    prix_achat: 8.0,
    prix_vente: 29.0,
    image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MHx8fHwxNzc0NjA5ODE1fDA&ixlib=rb-4.1.0&q=85",
    description: "Écouteurs sans fil avec réduction de bruit",
    cible: "16-40 ans, utilisateurs smartphone",
    angle_marketing: "Son premium sans se ruiner"
  },
  {
    name: "Portable Blender",
    prix_achat: 15.0,
    prix_vente: 45.0,
    image_url: "https://images.pexels.com/photos/5514988/pexels-photo-5514988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Blender portable rechargeable USB",
    cible: "20-45 ans, fitness/santé",
    angle_marketing: "Smoothies partout, toujours"
  },
  {
    name: "Smart Fitness Watch",
    prix_achat: 14.0,
    prix_vente: 49.0,
    image_url: "https://images.pexels.com/photos/4482932/pexels-photo-4482932.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Montre connectée sport et santé",
    cible: "18-50 ans, sportifs",
    angle_marketing: "Votre coach au poignet"
  },
  {
    name: "Resistance Band Set",
    prix_achat: 5.0,
    prix_vente: 25.0,
    image_url: "https://images.pexels.com/photos/6667512/pexels-photo-6667512.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "Set de bandes élastiques musculation",
    cible: "18-55 ans, fitness à domicile",
    angle_marketing: "Salle de sport dans votre salon"
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    prix_achat: "",
    prix_vente: "",
    image_url: "",
    description: "",
    cible: "",
    angle_marketing: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      if (res.data.length === 0) {
        // Initialize with default products
        for (const product of DEFAULT_PRODUCTS) {
          await axios.post(`${API}/products`, product);
        }
        const newRes = await axios.get(`${API}/products`);
        setProducts(newRes.data);
      } else {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Erreur chargement produits:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/products`, {
        ...formData,
        prix_achat: parseFloat(formData.prix_achat),
        prix_vente: parseFloat(formData.prix_vente)
      });
      toast.success("Produit ajouté !");
      fetchProducts();
      setShowForm(false);
      setFormData({
        name: "",
        prix_achat: "",
        prix_vente: "",
        image_url: "",
        description: "",
        cible: "",
        angle_marketing: ""
      });
    } catch (error) {
      console.error("Erreur ajout produit:", error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API}/products/${productId}`);
      toast.success("Produit supprimé");
      fetchProducts();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur de suppression");
    }
  };

  const generateContent = (productId) => {
    navigate(`/tiktok-scripts?product=${productId}`);
  };

  return (
    <div className="flex" data-testid="products-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              PRODUITS GAGNANTS
            </h1>
            <p className="text-base text-[#A1A1AA]">Gérez votre catalogue de produits tendances</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
            style={{borderRadius: '2px'}}
            data-testid="add-product-btn"
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Ajouter
          </Button>
        </div>

        {showForm && (
          <div className="metric-card p-6 mb-6" data-testid="product-form">
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
              NOUVEAU PRODUIT
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nom du produit"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-name"
                />
                <Input
                  placeholder="URL de l'image"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-image"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Prix d'achat (€)"
                  value={formData.prix_achat}
                  onChange={(e) => setFormData({...formData, prix_achat: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-prix-achat"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Prix de vente (€)"
                  value={formData.prix_vente}
                  onChange={(e) => setFormData({...formData, prix_vente: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-prix-vente"
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-description"
                />
                <Input
                  placeholder="Cible"
                  value={formData.cible}
                  onChange={(e) => setFormData({...formData, cible: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white"
                  data-testid="input-product-cible"
                />
                <Input
                  placeholder="Angle marketing"
                  value={formData.angle_marketing}
                  onChange={(e) => setFormData({...formData, angle_marketing: e.target.value})}
                  required
                  className="bg-[#0A0A0A] border-[#27272A] text-white md:col-span-2"
                  data-testid="input-product-angle"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#34C759] hover:bg-[#2ea34a] text-white font-bold uppercase tracking-wide w-full"
                style={{borderRadius: '2px'}}
                data-testid="submit-product-btn"
              >
                Créer le produit
              </Button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => {
              const marge = product.prix_vente - product.prix_achat;
              const margePercent = ((marge / product.prix_achat) * 100).toFixed(0);

              return (
                <div key={product.id} className="product-card" data-testid={`product-card-${product.id}`}>
                  <div className="aspect-video overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold tracking-tight uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#A1A1AA] mb-3">{product.description}</p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-[#71717A] uppercase tracking-wide">Achat</p>
                        <p className="text-lg font-bold">{product.prix_achat}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#71717A] uppercase tracking-wide">Vente</p>
                        <p className="text-lg font-bold text-[#34C759]">{product.prix_vente}€</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-[#71717A] uppercase tracking-wide">Marge</p>
                        <p className="text-lg font-bold text-[#007AFF]">{marge}€ ({margePercent}%)</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Cible</p>
                      <p className="text-sm text-white">{product.cible}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Angle</p>
                      <p className="text-sm text-white">{product.angle_marketing}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => generateContent(product.id)}
                        className="flex-1 bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase text-xs"
                        style={{borderRadius: '2px'}}
                        data-testid={`generate-content-btn-${product.id}`}
                      >
                        <Sparkle size={16} weight="bold" className="mr-1" />
                        Générer
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="destructive"
                        className="font-bold uppercase text-xs"
                        style={{borderRadius: '2px'}}
                        data-testid={`delete-product-btn-${product.id}`}
                      >
                        <Trash size={16} weight="bold" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;