import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const pollPaymentStatus = async (sessionId, currentAttempt = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (currentAttempt >= maxAttempts) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/checkout/status/${sessionId}`);
      setStatus(res.data);
      setAttempts(currentAttempt + 1);

      if (res.data.payment_status === 'paid') {
        setLoading(false);
        return;
      } else if (res.data.status === 'expired') {
        setLoading(false);
        return;
      }

      setTimeout(() => pollPaymentStatus(sessionId, currentAttempt + 1), pollInterval);
    } catch (error) {
      console.error("Erreur vérification paiement:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex" data-testid="success-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="metric-card p-12 max-w-2xl w-full text-center">
          {loading ? (
            <div data-testid="payment-checking">
              <div className="animate-spin w-16 h-16 border-4 border-[#007AFF] border-t-transparent rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-bold tracking-tight uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
                VÉRIFICATION DU PAIEMENT
              </h2>
              <p className="text-[#A1A1AA]">
                Tentative {attempts + 1}/5...
              </p>
            </div>
          ) : status?.payment_status === 'paid' ? (
            <div data-testid="payment-success">
              <CheckCircle size={80} weight="fill" className="text-[#34C759] mx-auto mb-6" />
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                PAIEMENT RÉUSSI !
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-6">
                Merci pour votre achat. Vous pouvez maintenant profiter pleinement de la plateforme.
              </p>
              <div className="bg-[#0A0A0A] p-6 mb-6" style={{borderRadius: '2px'}}>
                <p className="text-xs text-[#71717A] uppercase tracking-wide font-bold mb-2">
                  MONTANT PAYÉ
                </p>
                <p className="text-3xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                  {(status.amount_total / 100).toFixed(2)} {status.currency.toUpperCase()}
                </p>
              </div>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
                style={{borderRadius: '2px'}}
                data-testid="return-dashboard-btn"
              >
                Retour au Dashboard
                <ArrowRight size={20} weight="bold" className="ml-2" />
              </Button>
            </div>
          ) : (
            <div data-testid="payment-error">
              <div className="w-16 h-16 bg-[#FF3B30] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                ERREUR DE PAIEMENT
              </h2>
              <p className="text-[#A1A1AA] mb-6">
                Le paiement n'a pas pu être validé. Vérifiez votre email ou contactez le support.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#007AFF] hover:bg-[#0056B3] text-white font-bold uppercase tracking-wide"
                style={{borderRadius: '2px'}}
              >
                Retour au Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;