import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingBag,
  ShoppingCart,
  Users,
  UserRound
} from "lucide-react";

function Sidebar() {

  return (

    <aside className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">

      <div>

        <div className="p-6">

          <h1 className="text-3xl font-bold text-pink-500">
            Pastelería
          </h1>

          <p className="text-gray-500 text-sm">
            Sistema de Gestión
          </p>

        </div>

        <nav className="px-4 space-y-2">

          <Link
  to="/"
  className="flex items-center gap-3 bg-pink-100 text-pink-600 p-3 rounded-xl"
>

  <LayoutDashboard size={20} />

  Dashboard

</Link>

          <Link
      to="/ingredientes"
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
    >

      <Package size={20} />

      Ingredientes

          </Link>

          <Link to="/productos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer" >

          <ShoppingBag size={20} />

            Productos

          </Link>

          <Link to="/pedidos"
  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
>

  <ShoppingCart size={20} />

  Pedidos

</Link>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">

            <Users size={20} />
            Empleados

          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">

            <UserRound size={20} />
            Clientes

          </div>

        </nav>

      </div>

      <div className="p-6 text-gray-400 text-sm">
        © 2026 Pastelería Sistema
      </div>

    </aside>

  );
}

export default Sidebar;