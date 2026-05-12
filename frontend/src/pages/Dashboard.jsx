import StatsCard from "../components/StatsCard";
import { useEffect, useState } from "react";

function Dashboard() {

  const [productos, setProductos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/productos")
      .then(res => res.json())
      .then(data => {
        setProductos(data);
      });

    fetch("http://localhost:3000/ingredientes")
      .then(res => res.json())
      .then(data => {
        setIngredientes(data);
      });

  }, []);

  return (


      <main className="flex-1 p-8">

        <p className="text-gray-500 mb-8">
          Resumen general del inventario de la pastelería
        </p>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Ingredientes en Stock"
            value={ingredientes.length}
            subtitle="Datos reales"
            color="bg-blue-500"
          />


          <StatsCard
            title="Productos en Inventario"
            value={productos.length}
            subtitle="Datos reales"
            color="bg-pink-500"
          />

          <StatsCard
            title="Pedidos Activos"
            value="5"
            subtitle=""
            color="bg-green-500"
          />

        </div>

        {/* Tablas */}
        <div className="grid grid-cols-2 gap-6">

          {/* Productos */}
          <div className="bg-white rounded-3xl p-5 shadow-lg">

            <h2 className="text-xl font-bold mb-4">
              Productos Recientes
            </h2>

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left border-b border-gray-200/100">

                  <th className="pb-4">Nombre</th>
                  <th className="pb-4">Precio</th>
                  <th className="pb-4">Estado</th>

                </tr>

              </thead>

              <tbody>

                {productos.map((producto) => (

                  <tr
                    key={producto.id}
                    className="border-b border-gray-200/100"
                  >

                    <td className="py-3">
                      {producto.nombre}
                    </td>

                    <td>
                      ${producto.precio}
                    </td>

                    <td className="py-3">

                      {producto.alerta_stock ? (

                        <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs">
                          Bajo stock
                        </span>

                      ) : (

                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                          Disponible
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Ingredientes */}
          <div className="bg-white rounded-3xl p-5 shadow-lg">

            <h2 className="text-xl font-bold mb-4">
              Ingredientes Recientes
            </h2>

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left border-b border-gray-200/100">

                  <th className="pb-4">Ingrediente</th>
                  <th className="pb-4">Cantidad</th>
                  <th className="pb-4">Estado</th>

                </tr>

              </thead>

              <tbody>

                {ingredientes.map((ingrediente) => (

                  <tr
                    key={ingrediente.id}
                    className="border-b border-gray-200/100"
                  >

                    <td className="py-3">
                      {ingrediente.nombre}
                    </td>

                    <td>
                      {ingrediente.cantidad_stock}
                    </td>

                    <td>

                      {ingrediente.alerta_stock ? (

                        <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs">

                          Bajo stock

                        </span>

                      ) : (

                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">

                          Disponible

                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

  );
}

export default Dashboard;