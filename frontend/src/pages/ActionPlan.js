import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { CheckCircle, Circle, Target } from "@phosphor-icons/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ActionPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedDays, setCompletedDays] = useState([]);

  useEffect(() => {
    fetchPlan();
    const saved = localStorage.getItem('completedDays');
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`${API}/action-plan`);
      setPlan(res.data);
    } catch (error) {
      console.error("Erreur chargement plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (jour) => {
    let updated;
    if (completedDays.includes(jour)) {
      updated = completedDays.filter(d => d !== jour);
    } else {
      updated = [...completedDays, jour];
    }
    setCompletedDays(updated);
    localStorage.setItem('completedDays', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex" data-testid="action-plan-loading">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          <p className="text-[#A1A1AA]">Chargement...</p>
        </div>
      </div>
    );
  }

  const progress = (completedDays.length / 7) * 100;

  return (
    <div className="flex" data-testid="action-plan-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            PLAN D'ACTION 7 JOURS
          </h1>
          <p className="text-base text-[#A1A1AA]">Roadmap pour atteindre 1000€/jour</p>
        </div>

        <div className="metric-card p-6 mb-6" data-testid="progress-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-1">
                PROGRESSION
              </p>
              <p className="text-3xl font-black" style={{fontFamily: 'Barlow Condensed'}}>
                {completedDays.length}/7 JOURS
              </p>
            </div>
            <Target size={48} weight="bold" className="text-[#007AFF]" />
          </div>
          <div className="w-full bg-[#1A1A1A] h-3" style={{borderRadius: '2px'}}>
            <div
              className="h-3 bg-[#007AFF] transition-all duration-300"
              style={{ width: `${progress}%`, borderRadius: '2px' }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {plan?.plan_7_jours?.map((day) => {
            const isCompleted = completedDays.includes(day.jour);
            
            return (
              <div 
                key={day.jour} 
                className={`metric-card p-6 cursor-pointer transition-all ${
                  isCompleted ? 'border-[#34C759]' : ''
                }`}
                onClick={() => toggleDay(day.jour)}
                data-testid={`day-${day.jour}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle size={32} weight="fill" className="text-[#34C759]" />
                    ) : (
                      <Circle size={32} weight="bold" className="text-[#71717A]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#007AFF] px-3 py-1" style={{borderRadius: '2px'}}>
                        <p className="text-sm font-black" style={{fontFamily: 'Barlow Condensed'}}>
                          JOUR {day.jour}
                        </p>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight uppercase" style={{fontFamily: 'Barlow Condensed'}}>
                        {day.titre}
                      </h3>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                        ACTIONS
                      </p>
                      <ul className="space-y-2">
                        {day.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#007AFF] font-bold mt-1">•</span>
                            <span className={isCompleted ? 'text-[#A1A1AA] line-through' : 'text-white'}>
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0A0A0A] p-3 border-l-4 border-[#FF9500]" style={{borderRadius: '2px'}}>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-1">
                        OBJECTIF
                      </p>
                      <p className="text-lg font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>
                        {day.objectif}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="metric-card p-6 mt-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
            CONSEILS CRITIQUES
          </h2>
          <ul className="space-y-2 text-[#A1A1AA]">
            <li className="flex items-start gap-2">
              <span className="text-[#FF3B30] font-bold">⚠️</span>
              <span>La clé c'est la CONSTANCE. Ne saute AUCUN jour.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3B30] font-bold">⚠️</span>
              <span>Si un produit ne convertit pas après 50 vues, passe au suivant immédiatement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3B30] font-bold">⚠️</span>
              <span>Scale UNIQUEMENT ce qui fonctionne. Ne gaspille pas sur ce qui ne marche pas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3B30] font-bold">⚠️</span>
              <span>Track TOUT. Si tu ne mesures pas, tu ne peux pas optimiser.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;