import { Route, Routes } from "react-router-dom";

import ProductListPage from "@/pages/products";

function App() {
  return (
    <Routes>
      <Route element={<ProductListPage />} path="/" />
    </Routes>
  );
}

export default App;
