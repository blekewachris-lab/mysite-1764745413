import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { TrendUp, TrendDown, ShoppingCart, Target } from "@phosphor-icons/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        axios.get(`${API}/analytics/today`),
        axios.get(`${API}/analytics/history`)
      ]);
      setAnalytics(todayRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Erreur chargement analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex" data-testid="dashboard-loading">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          <p className="text-[#A1A1AA]">Chargement...</p>
        </div>
      </div>
    );
  }

  const progress = analytics ? (analytics.ca_journalier / analytics.objectif) * 100 : 0;
  const chartData = history.map(item => ({
    date: item.date,
    ca: item.ca_journalier
  })).reverse();

  return (
    <div className="flex" data-testid="dashboard">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            COMMAND CENTER
          </h1>
          <p className="text-base text-[#A1A1AA]">Pilotez votre business vers 1000€/jour</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* CA Journalier */}
          <div className="metric-card p-6" data-testid="metric-ca">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                CA AUJOURD'HUI
              </p>
              <Target size={24} weight="bold" className="text-[#34C759]" />
            </div>
            <p className="text-4xl font-black mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              {analytics?.ca_journalier?.toFixed(2) || '0.00'}€
            </p>
            <div className="flex items-center gap-2 text-sm">
              {progress >= 50 ? (
                <TrendUp size={16} weight="bold" className="text-[#34C759]" />
              ) : (
                <TrendDown size={16} weight="bold" className="text-[#FF9500]" />
              )}
              <span className="text-[#A1A1AA]">{progress.toFixed(1)}% de l'objectif</span>
            </div>
          </div>

          {/* Nombre de ventes */}
          <div className="metric-card p-6" data-testid="metric-ventes">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                VENTES
              </p>
              <ShoppingCart size={24} weight="bold" className="text-[#007AFF]" />
            </div>
            <p className="text-4xl font-black mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              {analytics?.nb_ventes || 0}
            </p>
            <p className="text-sm text-[#A1A1AA]">Transactions effectuées</p>
          </div>

          {/* Objectif */}
          <div className="metric-card p-6" data-testid="metric-objectif">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                OBJECTIF
              </p>
              <Target size={24} weight="bold" className="text-[#FF3B30]" />
            </div>
            <p className="text-4xl font-black mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              {analytics?.objectif || 1000}€
            </p>
            <div className="w-full bg-[#1A1A1A] h-2 mt-3" style={{borderRadius: '2px'}}>
              <div
                className="h-2 bg-[#007AFF]"
                style={{ width: `${Math.min(progress, 100)}%`, borderRadius: '2px' }}
              />
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className="metric-card p-6" data-testid="chart-container">
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-6" style={{fontFamily: 'Barlow Condensed'}}>
            ÉVOLUTION CA
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#71717A" 
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#71717A" 
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111111', 
                    border: '1px solid #27272A',
                    borderRadius: '2px',
                    color: '#FFFFFF'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ca" 
                  stroke="#007AFF" 
                  strokeWidth={3}
                  dot={{ fill: '#007AFF', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#A1A1AA] text-center py-8">Aucune donnée disponible</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a
            href="/products"
            className="metric-card p-6 block hover:border-[#007AFF] transition-colors"
            data-testid="quick-action-products"
          >
            <h3 className="text-xl font-bold tracking-tight uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              GÉRER LES PRODUITS
            </h3>
            <p className="text-sm text-[#A1A1AA]">Ajoutez et gérez vos produits gagnants</p>
          </a>

          <a
            href="/action-plan"
            className="metric-card p-6 block hover:border-[#34C759] transition-colors"
            data-testid="quick-action-plan"
          >
            <h3 className="text-xl font-bold tracking-tight uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
              PLAN D'ACTION 7 JOURS
            </h3>
            <p className="text-sm text-[#A1A1AA]">Suivez le plan pour atteindre 1000€/jour</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;