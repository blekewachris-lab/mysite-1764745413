import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import TikTokScripts from "@/pages/TikTokScripts";
import DMScripts from "@/pages/DMScripts";
import SalesPages from "@/pages/SalesPages";
import Strategy from "@/pages/Strategy";
import ActionPlan from "@/pages/ActionPlan";
import Success from "@/pages/Success";
import Store from "@/pages/Store";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/tiktok-scripts" element={<TikTokScripts />} />
          <Route path="/dm-scripts" element={<DMScripts />} />
          <Route path="/sales-pages" element={<SalesPages />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="/action-plan" element={<ActionPlan />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/store" element={<Store />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;