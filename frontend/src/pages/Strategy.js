import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { ChartLine, Lightning, Users, TrendUp } from "@phosphor-icons/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Strategy = () => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategy();
  }, []);

  const fetchStrategy = async () => {
    try {
      const res = await axios.get(`${API}/strategy`);
      setStrategy(res.data);
    } catch (error) {
      console.error("Erreur chargement stratégie:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex" data-testid="strategy-loading">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          <p className="text-[#A1A1AA]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" data-testid="strategy-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            STRATÉGIES DE SCALE
          </h1>
          <p className="text-base text-[#A1A1AA]">Tactiques agressives pour atteindre 1000€/jour</p>
        </div>

        <div className="space-y-6">
          {/* Stratégie Multi-Comptes */}
          <div className="metric-card p-6" data-testid="multi-comptes-strategy">
            <div className="flex items-center gap-3 mb-4">
              <Users size={32} weight="bold" className="text-[#007AFF]" />
              <h2 className="text-2xl font-bold tracking-tight uppercase" style={{fontFamily: 'Barlow Condensed'}}>
                {strategy?.multi_comptes?.titre}
              </h2>
            </div>
            <p className="text-[#A1A1AA] mb-4">{strategy?.multi_comptes?.description}</p>
            <div className="space-y-2">
              {strategy?.multi_comptes?.points?.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[#007AFF] font-bold mt-1">•</span>
                  <span className="text-white">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trafic Gratuit */}
          <div className="metric-card p-6" data-testid="trafic-gratuit-strategy">
            <div className="flex items-center gap-3 mb-4">
              <Lightning size={32} weight="bold" className="text-[#FF9500]" />
              <h2 className="text-2xl font-bold tracking-tight uppercase" style={{fontFamily: 'Barlow Condensed'}}>
                {strategy?.trafic_gratuit?.titre}
              </h2>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                HASHTAGS PUISSANTS
              </p>
              <div className="flex flex-wrap gap-2">
                {strategy?.trafic_gratuit?.hashtags?.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-[#007AFF] text-white px-3 py-1 text-sm font-bold"
                    style={{borderRadius: '2px'}}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                TACTIQUES
              </p>
              <div className="space-y-2">
                {strategy?.trafic_gratuit?.tactiques?.map((tactique, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-[#FF9500] font-bold mt-1">•</span>
                    <span className="text-white">{tactique}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan de Scale */}
          <div className="metric-card p-6" data-testid="scale-strategy">
            <div className="flex items-center gap-3 mb-4">
              <TrendUp size={32} weight="bold" className="text-[#34C759]" />
              <h2 className="text-2xl font-bold tracking-tight uppercase" style={{fontFamily: 'Barlow Condensed'}}>
                {strategy?.scale?.titre}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {strategy?.scale?.etapes?.map((etape, index) => (
                <div 
                  key={index} 
                  className="bg-[#0A0A0A] p-4 border-l-4 border-[#34C759]"
                  style={{borderRadius: '2px'}}
                >
                  <p className="text-white font-semibold">{etape}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-3">
                BUDGET PUBLICITÉ RECOMMANDÉ
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0A0A0A] p-4" style={{borderRadius: '2px'}}>
                  <p className="text-xs text-[#71717A] uppercase mb-1">Phase 1</p>
                  <p className="text-xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
                    {strategy?.scale?.budget_pub?.phase1}
                  </p>
                </div>
                <div className="bg-[#0A0A0A] p-4" style={{borderRadius: '2px'}}>
                  <p className="text-xs text-[#71717A] uppercase mb-1">Phase 2</p>
                  <p className="text-xl font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>
                    {strategy?.scale?.budget_pub?.phase2}
                  </p>
                </div>
                <div className="bg-[#0A0A0A] p-4" style={{borderRadius: '2px'}}>
                  <p className="text-xs text-[#71717A] uppercase mb-1">Phase 3</p>
                  <p className="text-xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                    {strategy?.scale?.budget_pub?.phase3}
                  </p>
                </div>
                <div className="bg-[#0A0A0A] p-4" style={{borderRadius: '2px'}}>
                  <p className="text-xs text-[#71717A] uppercase mb-1">Phase 4</p>
                  <p className="text-xl font-black text-[#FF3B30]" style={{fontFamily: 'Barlow Condensed'}}>
                    {strategy?.scale?.budget_pub?.phase4}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strategy;