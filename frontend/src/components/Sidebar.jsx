import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  ChefHat,
  ShoppingCart,
  LogOut
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const rol = localStorage.getItem("rol");

  const cerrarSesion = () => {

    localStorage.removeItem("rol");

    navigate("/login");

  };

  return (

    <>
    
      {/* PANEL FLOTANTE */}
      <div className="fixed top-5 right-5 z-50">

        <div className="bg-white shadow-xl border rounded-2xl p-4 w-[240px]">

          <p className="font-bold text-lg capitalize">
            {rol}
          </p>

          <p className="text-gray-500 text-sm mb-4">
            Sesión activa
          </p>

          <button
            onClick={cerrarSesion}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >

            <LogOut size={18} />

            Cerrar Sesión

          </button>

        </div>

      </div>

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r min-h-screen p-6">

        {/* LOGO */}
        <div className="mb-10">

          <h1 className="text-3xl font-bold text-pink-500">
            Pastelería
          </h1>

          <p className="text-gray-500 mt-1">
            Sistema Administrativo
          </p>

        </div>

        {/* MENU */}
        <nav className="space-y-3">

          {/* DASHBOARD */}
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
          >

            <LayoutDashboard size={20} />

            Dashboard

          </Link>

          {/* PRODUCTOS */}
          {[
            "admin",
            "empleado_inventario",
            "empleado_normal",
            "cliente",
            "empleado_ventas"
          ].includes(rol) && (

            <Link
              to="/productos"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >

              <Package size={20} />

              Productos

            </Link>

          )}

          {/* INGREDIENTES */}
          {[
            "admin",
            "empleado_inventario"
          ].includes(rol) && (

            <Link
              to="/ingredientes"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >

              <ChefHat size={20} />

              Ingredientes

            </Link>

          )}

          {/* PEDIDOS */}
          {[
            "admin",
            "empleado_ventas"
          ].includes(rol) && (

            <Link
              to="/pedidos"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >

              <ClipboardList size={20} />

              Pedidos

            </Link>

          )}

          {/* CLIENTES */}
          {[
            "admin",
            "empleado_ventas",
            "empleado_normal"
          ].includes(rol) && (

            <Link
              to="/clientes"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >

              <ShoppingCart size={20} />

              Clientes

            </Link>

          )}

          {/* EMPLEADOS */}
          {rol === "admin" && (

            <Link
              to="/empleados"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >

              <Users size={20} />

              Empleados

            </Link>

          )}

        </nav>

      </aside>

    </>

  );

}

export default Sidebar;