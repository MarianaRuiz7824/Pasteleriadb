import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Ingredientes from "./pages/Ingredientes";


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

        </Routes>

      </div>

    </BrowserRouter>

  );
}

export default App;