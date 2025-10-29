import { Route, Routes } from "react-router-dom";

import ProductListPage from "@/pages/products";
import DashboardPage from "@/pages/dashboard";

function App() {
  return (
    <Routes>
      <Route element={<ProductListPage />} path="/" />
      <Route element={<DashboardPage />} path="/dashboard" />
    </Routes>
  );
}

export default App;
