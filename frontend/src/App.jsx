import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Ingredientes from "./pages/Ingredientes";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Empleados from "./pages/Empleados";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";

function App() {

  if (
    !localStorage.getItem("rol") &&
    window.location.pathname !== "/login"
  ) {

    window.location.href = "/login";

  }

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="*"
          element={

            <div className="flex bg-[#f5f6fa] min-h-screen">

              <Sidebar />

              <Routes>

                <Route
                  path="/"
                  element={<Dashboard />}
                />

                <Route
                  path="/ingredientes"
                  element={<Ingredientes />}
                />

                <Route
                  path="/productos"
                  element={<Productos />}
                />

                <Route
                  path="/pedidos"
                  element={<Pedidos />}
                />

                <Route
                  path="/empleados"
                  element={<Empleados />}
                />

                <Route
                  path="/clientes"
                  element={<Clientes />}
                />

              </Routes>

            </div>

          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;