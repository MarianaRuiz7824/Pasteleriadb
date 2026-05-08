import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Package
} from "lucide-react";

function Productos() {

  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [ingredientesProducto, setIngredientesProducto] = useState([]);

  useEffect(() => {

  fetch("http://localhost:3000/productos")
    .then(res => res.json())
    .then(async (data) => {

      setProductos(data);

      if (data.length > 0) {

        setSelectedProducto(data[0]);

        // cargar ingredientes del primero
        const resIngredientes = await fetch(
          `http://localhost:3000/productos/${data[0].id}/ingredientes`
        );

        const ingredientes = await resIngredientes.json();

        setIngredientesProducto(ingredientes);

      }

    });

}, []);

  const verProducto = async (producto) => {

  try {

    setSelectedProducto(producto);

    const res = await fetch(
      `http://localhost:3000/productos/${producto.id}/ingredientes`
    );

    console.log(res);

    const data = await res.json();

    console.log(data);

    setIngredientesProducto(data);

  } catch (error) {

    console.log("ERROR:", error);

  }

};

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = productos.reduce(
    (sum, p) => sum + p.cantidad_stock,
    0
  );

  const valorTotal = productos.reduce(
    (sum, p) => sum + (p.precio * p.cantidad_stock),
    0
  );

  const promedio =
    productos.length > 0
      ? valorTotal / productos.length
      : 0;

  return (

    <main className="flex-1 p-8">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Productos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de productos terminados y recetas
        </p>

      </div>

      {/* Barra */}
      <div className="bg-white rounded-2xl border p-4 mb-6 flex gap-4">

        <div className="flex-1 relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-10 py-3 outline-none"
          />

        </div>

        <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 rounded-xl flex items-center gap-2">

          <Plus size={20} />

          Agregar Producto

        </button>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <div className="bg-white rounded-2xl border p-6">
          <p className="text-gray-500 mb-2">
            Total Productos
          </p>

          <h2 className="text-5xl font-bold">
            {productos.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <p className="text-gray-500 mb-2">
            Unidades en Stock
          </p>

          <h2 className="text-5xl font-bold">
            {totalStock}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <p className="text-gray-500 mb-2">
            Valor Total
          </p>

          <h2 className="text-4xl font-bold">
            ${valorTotal.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <p className="text-gray-500 mb-2">
            Precio Promedio
          </p>

          <h2 className="text-4xl font-bold">
            ${promedio.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* Tabla + panel */}
      <div className="grid grid-cols-3 gap-6">

        {/* Tabla */}
        <div className="col-span-2 bg-white rounded-2xl border overflow-hidden">

          <table className="w-full">

            <thead className="border-b bg-gray-50">

              <tr>

                <th className="text-left p-4">
                  ID
                </th>

                <th className="text-left p-4">
                  Nombre
                </th>

                <th className="text-left p-4">
                  Precio
                </th>

                <th className="text-left p-4">
                  Stock
                </th>

                <th className="text-left p-4">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProductos.map((producto) => (

                <tr
                  key={producto.id}
                  className={`border-b hover:bg-pink-50 transition ${
                    selectedProducto?.id === producto.id
                      ? "bg-pink-50"
                      : ""
                  }`}
                >

                  <td className="p-4">
                    {producto.id}
                  </td>

                  <td className="p-4 font-medium">
                    {producto.nombre}
                  </td>

                  <td className="p-4">
                    ${producto.precio}
                  </td>

                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                      {producto.cantidad_stock} uds

                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      {/* OJO */}
                      <button
                        onClick={() => verProducto(producto)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <Eye size={20} />
                      </button>

                      <button className="text-blue-500">
                        <Pencil size={20} />
                      </button>

                      <button className="text-red-500">
                        <Trash2 size={20} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* PANEL DERECHO */}
        <div className="bg-white rounded-2xl border p-6">

          {selectedProducto && (

            <>

              <div className="flex items-center gap-4 mb-6">

                <div className="bg-pink-100 p-4 rounded-2xl">

                  <Package
                    className="text-pink-500"
                    size={30}
                  />

                </div>

                <div>

                  <h2 className="text-3xl font-bold">
                    {selectedProducto.nombre}
                  </h2>

                  <p className="text-gray-500">
                    Detalles del producto
                  </p>

                </div>

              </div>

              <div className="space-y-6">
                <div className="border-t pt-6">

  <h3 className="font-bold text-lg mb-4">
    Ingredientes Utilizados
  </h3>

  <div className="space-y-3">

    {ingredientesProducto.length > 0 ? (

  ingredientesProducto.map((ingrediente, index) => (

    <div
      key={index}
      className="flex justify-between border-b pb-2"
    >

      <span className="text-black font-medium">
        {ingrediente.nombre}
      </span>

      <span className="text-pink-600 font-bold">
        {ingrediente.cantidad} {ingrediente.unidad_medida}
      </span>

    </div>

  ))

) : (

  <p className="text-red-500">
    No hay ingredientes cargados
  </p>

)}

  </div>

</div>

                <div>

                  <p className="text-gray-500 mb-1">
                    Precio
                  </p>

                  <h3 className="text-4xl font-bold">
                    ${selectedProducto.precio}
                  </h3>

                </div>

                <div>

                  <p className="text-gray-500 mb-1">
                    Stock Disponible
                  </p>

                  <h3 className="text-4xl font-bold">
                    {selectedProducto.cantidad_stock} unidades
                  </h3>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </main>

  );
}

export default Productos;