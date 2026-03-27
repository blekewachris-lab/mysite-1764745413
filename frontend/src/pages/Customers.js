import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Users, EnvelopeSimple, ShoppingCart } from "@phosphor-icons/react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/customers`);
      setCustomers(res.data);
    } catch (error) {
      console.error("Erreur chargement clients:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (email) => {
    try {
      const res = await axios.get(`${API}/customers/${encodeURIComponent(email)}/orders`);
      setCustomerOrders(res.data);
    } catch (error) {
      console.error("Erreur chargement commandes client:", error);
    }
  };

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.email);
  };

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const avgOrderValue = totalRevenue / (customers.reduce((sum, c) => sum + c.total_orders, 0) || 1);

  return (
    <div className="flex" data-testid="customers-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            CLIENTS
          </h1>
          <p className="text-base text-[#A1A1AA]">CRM - Gestion de la relation client</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                TOTAL CLIENTS
              </p>
              <Users size={24} weight="bold" className="text-[#007AFF]" />
            </div>
            <p className="text-4xl font-black" style={{fontFamily: 'Barlow Condensed'}}>
              {totalCustomers}
            </p>
          </div>

          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                REVENUE TOTAL
              </p>
              <ShoppingCart size={24} weight="bold" className="text-[#34C759]" />
            </div>
            <p className="text-4xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
              {totalRevenue.toFixed(2)}€
            </p>
          </div>

          <div className="metric-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
                PANIER MOYEN
              </p>
              <EnvelopeSimple size={24} weight="bold" className="text-[#FF9500]" />
            </div>
            <p className="text-4xl font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>
              {avgOrderValue.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-[#111111] border border-[#27272A] p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto" style={{borderRadius: '4px'}} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                DÉTAILS CLIENT
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Nom</p>
                  <p className="text-white font-bold">{selectedCustomer.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Email</p>
                  <p className="text-white font-bold">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Commandes</p>
                  <p className="text-2xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
                    {selectedCustomer.total_orders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Total Dépensé</p>
                  <p className="text-2xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                    {selectedCustomer.total_spent.toFixed(2)}€
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight uppercase mb-4" style={{fontFamily: 'Barlow Condensed'}}>
                HISTORIQUE COMMANDES
              </h3>

              <div className="space-y-3">
                {customerOrders.length === 0 ? (
                  <p className="text-[#71717A]">Aucune commande</p>
                ) : (
                  customerOrders.map(order => (
                    <div key={order.id} className="bg-[#0A0A0A] p-4 border border-[#27272A]" style={{borderRadius: '2px'}}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold">{order.order_number}</p>
                          <p className="text-sm text-[#71717A]">{order.product_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                            {order.total_amount.toFixed(2)}€
                          </p>
                          <p className="text-xs text-[#71717A]">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customers List */}
        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : customers.length === 0 ? (
          <div className="metric-card p-12 text-center">
            <Users size={48} weight="bold" className="text-[#71717A] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#A1A1AA]">Aucun client</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {customers.map((customer) => (
              <div 
                key={customer.id} 
                className="metric-card p-6 cursor-pointer hover:border-[#007AFF] transition-colors"
                onClick={() => viewCustomer(customer)}
                data-testid={`customer-${customer.id}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xl font-bold tracking-tight uppercase mb-1" style={{fontFamily: 'Barlow Condensed'}}>
                      {customer.name || "Client"}
                    </p>
                    <p className="text-sm text-[#71717A]">{customer.email}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Commandes</p>
                      <p className="text-2xl font-black text-[#007AFF]" style={{fontFamily: 'Barlow Condensed'}}>
                        {customer.total_orders}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Dépensé</p>
                      <p className="text-2xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                        {customer.total_spent.toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Moyen/Cmd</p>
                      <p className="text-2xl font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>
                        {(customer.total_spent / customer.total_orders).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;