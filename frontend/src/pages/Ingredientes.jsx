import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Calendar
} from "lucide-react";

function Ingredientes() {

  const [ingredientes, setIngredientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    fetch("http://localhost:3000/ingredientes")
      .then((res) => res.json())
      .then((data) => {
        setIngredientes(data);
      });

  }, []);

  const filteredIngredientes = ingredientes.filter((ing) =>
    ing.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock) => {

    if (stock < 20) {
      return "bg-red-100 text-red-600";
    }

    if (stock < 40) {
      return "bg-yellow-100 text-yellow-600";
    }

    return "bg-green-100 text-green-600";
  };

  return (

    <div className="flex-1 p-8 bg-[#f5f6fa] min-h-screen">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Ingredientes
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de ingredientes y materias primas
        </p>

      </div>

      {/* Barra superior */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex items-center justify-between gap-4">

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

        </div>

        <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition">

          <Plus size={20} />

          Agregar Ingrediente

        </button>

      </div>

      {/* Alerta */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">

        <div className="flex items-start gap-3">

          <AlertCircle className="text-orange-500 mt-1" size={22} />

          <div>

            <h3 className="font-bold text-orange-700 text-lg">
              Alertas de Inventario
            </h3>

            <p className="text-orange-600 text-sm mt-1">
              Hay ingredientes con bajo stock o próximos a caducar.
            </p>

          </div>

        </div>

      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-gray-700 text-sm">

              <th className="text-left p-5">ID</th>
              <th className="text-left p-5">Nombre</th>
              <th className="text-left p-5">Unidad</th>
              <th className="text-left p-5">Stock</th>
              <th className="text-left p-5">Precio/Unidad</th>
              <th className="text-left p-5">Caducidad</th>
              <th className="text-left p-5">Estado</th>
              <th className="text-left p-5">Acciones</th>

            </tr>

          </thead>

          <tbody>

            {filteredIngredientes.map((ingrediente) => (

              <tr
                key={ingrediente.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-5">
                  {ingrediente.id}
                </td>

                <td className="p-5 font-semibold">
                  {ingrediente.nombre}
                </td>

                <td className="p-5">
                  {ingrediente.unidad_medida}
                </td>

                <td className="p-5">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(ingrediente.cantidad_stock)}`}
                  >
                    {ingrediente.cantidad_stock}
                  </span>

                </td>

                <td className="p-5">
                  ${ingrediente.precio_por_unidad}
                </td>

                <td className="p-5">

                  <div className="flex items-center gap-2 text-orange-500">

                    <Calendar size={16} />

                    {ingrediente.fecha_caducidad}

                  </div>

                </td>

                <td className="p-5">

                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

                    <AlertCircle size={14} />

                    Por caducar

                  </span>

                </td>

                <td className="p-5">

                  <div className="flex gap-4">

                    <button className="text-blue-500 hover:scale-110 transition">
                      <Edit size={18} />
                    </button>

                    <button className="text-red-500 hover:scale-110 transition">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="bg-white border rounded-2xl p-5 mt-6 flex justify-between text-gray-700">

        <p>
          Total de ingredientes:
          <strong> {filteredIngredientes.length}</strong>
        </p>

        <p>

          Valor total aproximado:
          <strong>

            $
            {filteredIngredientes
              .reduce(
                (sum, i) =>
                  sum +
                  (Number(i.precio_por_unidad) *
                    Number(i.cantidad_stock)),
                0
              )
              .toFixed(2)}

          </strong>

        </p>

      </div>

    </div>

  );
}

export default Ingredientes;