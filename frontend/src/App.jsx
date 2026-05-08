import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Ingredientes from "./pages/Ingredientes";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";


function App() {

  return (

    <BrowserRouter>

      <div className="flex bg-[#f5f6fa] min-h-screen">

        <Sidebar />

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/pedidos" element={<Pedidos />} />

        </Routes>

      </div>

    </BrowserRouter>

  );
}

export default App;