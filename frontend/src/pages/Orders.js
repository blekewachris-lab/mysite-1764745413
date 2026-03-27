import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { Package, Check, X, Clock, Truck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_COLORS = {
  pending: "#FF9500",
  paid: "#34C759",
  processing: "#007AFF",
  shipped: "#5856D6",
  delivered: "#34C759",
  cancelled: "#FF3B30"
};

const STATUS_ICONS = {
  pending: Clock,
  paid: Check,
  processing: Package,
  shipped: Truck,
  delivered: Check,
  cancelled: X
};

const STATUS_LABELS = {
  pending: "En attente",
  paid: "Payé",
  processing: "En traitement",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé"
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const url = filterStatus ? `${API}/orders?status=${filterStatus}` : `${API}/orders`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API}/orders/${orderId}/status?status=${newStatus}`);
      toast.success("Statut mis à jour");
      fetchOrders();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error("Erreur de mise à jour");
    }
  };

  const totalRevenue = orders
    .filter(o => ["paid", "processing", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="flex" data-testid="orders-page">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-2" style={{fontFamily: 'Barlow Condensed'}}>
            COMMANDES
          </h1>
          <p className="text-base text-[#A1A1AA]">Gérez toutes les commandes clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="metric-card p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
              TOTAL COMMANDES
            </p>
            <p className="text-4xl font-black" style={{fontFamily: 'Barlow Condensed'}}>
              {orders.length}
            </p>
          </div>

          <div className="metric-card p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
              REVENUE TOTAL
            </p>
            <p className="text-4xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
              {totalRevenue.toFixed(2)}€
            </p>
          </div>

          <div className="metric-card p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A] mb-2">
              EN ATTENTE
            </p>
            <p className="text-4xl font-black text-[#FF9500]" style={{fontFamily: 'Barlow Condensed'}}>
              {orders.filter(o => o.status === "pending").length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="metric-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#71717A]">
              FILTRER PAR STATUT
            </p>
            <Select value={filterStatus || "all"} onValueChange={(val) => setFilterStatus(val === "all" ? "" : val)}>
              <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border-[#27272A]">
                <SelectItem value="all" className="text-white hover:bg-[#1A1A1A]">Tous</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-[#1A1A1A]">En attente</SelectItem>
                <SelectItem value="paid" className="text-white hover:bg-[#1A1A1A]">Payé</SelectItem>
                <SelectItem value="processing" className="text-white hover:bg-[#1A1A1A]">En traitement</SelectItem>
                <SelectItem value="shipped" className="text-white hover:bg-[#1A1A1A]">Expédié</SelectItem>
                <SelectItem value="delivered" className="text-white hover:bg-[#1A1A1A]">Livré</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-[#1A1A1A]">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <p className="text-[#A1A1AA]">Chargement...</p>
        ) : orders.length === 0 ? (
          <div className="metric-card p-12 text-center">
            <Package size={48} weight="bold" className="text-[#71717A] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#A1A1AA]">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status];
              const statusColor = STATUS_COLORS[order.status];

              return (
                <div key={order.id} className="metric-card p-6" data-testid={`order-${order.id}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-xl font-bold tracking-tight uppercase" style={{fontFamily: 'Barlow Condensed'}}>
                          {order.order_number}
                        </p>
                        <div 
                          className="px-3 py-1 flex items-center gap-2"
                          style={{backgroundColor: statusColor + '20', borderRadius: '2px'}}
                        >
                          <StatusIcon size={16} weight="bold" style={{color: statusColor}} />
                          <span className="text-xs font-bold uppercase" style={{color: statusColor}}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Produit</p>
                          <p className="text-white font-semibold">{order.product_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Client</p>
                          <p className="text-white font-semibold">{order.customer_name || order.customer_email}</p>
                          <p className="text-xs text-[#71717A]">{order.customer_email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#71717A] uppercase tracking-wide mb-1">Montant</p>
                          <p className="text-2xl font-black text-[#34C759]" style={{fontFamily: 'Barlow Condensed'}}>
                            {order.total_amount.toFixed(2)}€
                          </p>
                          <p className="text-xs text-[#71717A]">{order.quantity} × {order.unit_price}€</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#71717A] uppercase tracking-wide mb-2">Changer Statut</p>
                      <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                        <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111111] border-[#27272A]">
                          <SelectItem value="pending" className="text-white hover:bg-[#1A1A1A]">En attente</SelectItem>
                          <SelectItem value="paid" className="text-white hover:bg-[#1A1A1A]">Payé</SelectItem>
                          <SelectItem value="processing" className="text-white hover:bg-[#1A1A1A]">En traitement</SelectItem>
                          <SelectItem value="shipped" className="text-white hover:bg-[#1A1A1A]">Expédié</SelectItem>
                          <SelectItem value="delivered" className="text-white hover:bg-[#1A1A1A]">Livré</SelectItem>
                          <SelectItem value="cancelled" className="text-white hover:bg-[#1A1A1A]">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
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

export default Orders;
