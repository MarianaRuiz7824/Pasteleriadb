import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Package,
  CheckCircle
} from "lucide-react";

function Pedidos() {

  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [productosPedido, setProductosPedido] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/pedidos")
      .then(res => res.json())
      .then(async (data) => {

        setPedidos(data);

        if (data.length > 0) {

  setSelectedPedido(data[0]);

  const resProductos = await fetch(
    `http://localhost:3000/pedidos/${data[0].id}/productos`
  );

  const productos = await resProductos.json();

  setProductosPedido(productos);

}

      });

  }, []);

  const verPedido = async (pedido) => {

  setSelectedPedido(pedido);

  const res = await fetch(
    `http://localhost:3000/pedidos/${pedido.id}/productos`
  );

  const data = await res.json();

  setProductosPedido(data);

};

  const filteredPedidos = pedidos.filter((pedido) =>

    pedido.cliente_nombre
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  return (

    <main className="flex-1 p-8">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Pedidos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de pedidos y órdenes de clientes
        </p>

      </div>

      {/* BARRA */}
      <div className="bg-white rounded-2xl border p-4 mb-6 flex gap-4">

        <div className="flex-1 relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar pedidos por cliente o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 py-3 outline-none"
          />

        </div>

        <button className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-xl flex items-center gap-2">

          <Plus size={20} />

          Nuevo Pedido

        </button>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <div className="bg-white rounded-2xl border p-6">

          <p className="text-gray-500 mb-2">
            Total Pedidos
          </p>

          <h2 className="text-5xl font-bold">
            {pedidos.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border p-6">

          <p className="text-gray-500 mb-2">
            Pendientes
          </p>

          <h2 className="text-5xl font-bold text-orange-500">
            0
          </h2>

        </div>

        <div className="bg-white rounded-2xl border p-6">

          <p className="text-gray-500 mb-2">
            Entregados
          </p>

          <h2 className="text-5xl font-bold text-green-500">
            {pedidos.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border p-6">

          <p className="text-gray-500 mb-2">
            Valor Total
          </p>

          <h2 className="text-4xl font-bold">
            $2550.00
          </h2>

        </div>

      </div>

      {/* TABLA + PANEL */}
      <div className="grid grid-cols-3 gap-6">

        {/* TABLA */}
        <div className="col-span-2 bg-white rounded-2xl border overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-4">
                  ID
                </th>

                <th className="text-left p-4">
                  Cliente
                </th>

                <th className="text-left p-4">
                  Empleado
                </th>

                <th className="text-left p-4">
                  Solicitud
                </th>

                <th className="text-left p-4">
                  Entrega
                </th>

                <th className="text-left p-4">
                  Estado
                </th>

                <th className="text-left p-4">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPedidos.map((pedido) => (

                <tr
                  key={pedido.id}
                  className={`border-b hover:bg-green-50 transition ${
                    selectedPedido?.id === pedido.id
                      ? "bg-green-50"
                      : ""
                  }`}
                >

                  <td className="p-4 font-bold">
                    #{pedido.id}
                  </td>

                  <td className="p-4">

                    <div className="font-medium">
                      {pedido.cliente_nombre}
                    </div>

                  </td>

                  <td className="p-4">

                    <div>
                      {pedido.empleado_nombre}
                    </div>

                    <div className="text-gray-500 text-sm">
                      {pedido.posicion}
                    </div>

                  </td>

                  <td className="p-4">
                    {pedido.fecha_solicitud?.slice(0, 10)}
                  </td>

                  <td className="p-4">
                    {pedido.fecha_entrega?.slice(0, 10)}
                  </td>

                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

                      <CheckCircle size={16} />

                      Entregado

                    </span>

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => verPedido(pedido)}
                      className="text-green-500 hover:text-green-700"
                    >

                      <Eye size={20} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* PANEL DERECHO */}
        {selectedPedido && (

          <div className="bg-white rounded-2xl border p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-green-100 p-4 rounded-2xl">

                <Package
                  className="text-green-600"
                  size={30}
                />

              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Pedido #{selectedPedido.id}
                </h2>

                <p className="text-gray-500">
                  {selectedPedido.cliente_nombre}
                </p>

              </div>

            </div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
              Entregado
            </span>

            <div className="mt-8 space-y-6">

              <div>

                <h3 className="font-bold text-lg mb-2">
                  Cliente
                </h3>

                <p>{selectedPedido.cliente_nombre}</p>

                <p className="text-gray-500">
                  {selectedPedido.cliente_telefono}
                </p>

                <p className="text-gray-500">
                  {selectedPedido.cliente_email}
                </p>

              </div>

              <div>

                <h3 className="font-bold text-lg mb-2">
                  Atendido por
                </h3>

                <p>{selectedPedido.empleado_nombre}</p>

                <p className="text-gray-500">
                  {selectedPedido.posicion}
                </p>

              </div>

              <div>

                <h3 className="font-bold text-lg mb-2">
                  Fechas
                </h3>

                <p>
                  Solicitud: {selectedPedido.fecha_solicitud?.slice(0, 10)}
                </p>

                <p>
                  Entrega: {selectedPedido.fecha_entrega?.slice(0, 10)}
                </p>

              </div>

              <div>

                <h3 className="font-bold text-lg mb-2">
                  Comentarios
                </h3>

                <div className="bg-gray-100 rounded-xl p-4 text-gray-700">

                  {selectedPedido.comentarios}

                </div>

              </div>

              <div>

  <h3 className="font-bold text-lg mb-4">
    Productos
  </h3>

  <div className="space-y-4">

    {productosPedido.map((producto, index) => (

      <div
        key={index}
        className="border rounded-xl p-4"
      >

        <div className="font-semibold text-lg">
          {producto.nombre}
        </div>

        <div className="text-gray-500 mt-1">
          {producto.cantidad} x ${producto.precio}
        </div>

        <div className="text-right font-bold text-green-600 mt-2">
          ${producto.subtotal}
        </div>

      </div>

    ))}

  </div>

  <div className="border-t mt-6 pt-4 flex justify-between text-xl font-bold">

    <span>Total</span>

    <span>

      $

      {productosPedido
        .reduce(
          (sum, p) => sum + Number(p.subtotal),
          0
        )
        .toFixed(2)}

    </span>

  </div>

</div>

            </div>

          </div>

        )}

      </div>

    </main>

  );
}

export default Pedidos;