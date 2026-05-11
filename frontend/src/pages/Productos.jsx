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

  const rol = localStorage.getItem("rol");

  const puedeEditar = [
    "admin",
    "empleado_inventario"
  ].includes(rol);

  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedProducto, setSelectedProducto] =
    useState(null);

  const [ingredientesProducto, setIngredientesProducto] =
    useState([]);

  const [showModal, setShowModal] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({

    nombre: "",
    precio: "",
    cantidad_stock: "",
    fecha_elaboracion: ""

  });

  useEffect(() => {

    cargarProductos();

  }, []);

  const cargarProductos = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/productos",
        {
          headers: {
            rol
          }
        }
      );

      const data = await res.json();

      setProductos(
        Array.isArray(data) ? data : []
      );

      if (data.length > 0) {

        verProducto(data[0]);

      }

    } catch (error) {

      console.log(error);

    }

  };

  const verProducto = async (producto) => {

    try {

      setSelectedProducto(producto);

      const res = await fetch(
        `http://localhost:3000/productos/${producto.id}/ingredientes`,
        {
          headers: {
            rol
          }
        }
      );

      const data = await res.json();

      setIngredientesProducto(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.log(error);

    }

  };

  const agregarProducto = async () => {

    if (!puedeEditar) {

      alert(
        "No tienes permisos para agregar productos"
      );

      return;

    }

    try {

      const res = await fetch(
        "http://localhost:3000/productos",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            rol
          },

          body: JSON.stringify({

            nombre: nuevoProducto.nombre,

            precio: Number(
              nuevoProducto.precio
            ),

            cantidad_stock: Number(
              nuevoProducto.cantidad_stock
            ),

            fecha_elaboracion:
              nuevoProducto.fecha_elaboracion

          })

        }
      );

      if (!res.ok) {

        const error = await res.json();

        alert(
          error.error ||
          "No tienes permisos"
        );

        return;

      }

      cargarProductos();

      setShowModal(false);

      setNuevoProducto({

        nombre: "",
        precio: "",
        cantidad_stock: "",
        fecha_elaboracion: ""

      });

    } catch (error) {

      console.log(error);

    }

  };

  const editarProducto = async (producto) => {

    if (!puedeEditar) {

      alert(
        "No tienes permisos para editar productos"
      );

      return;

    }

    const nuevoStock = prompt(
      `Nuevo stock para ${producto.nombre}:`,
      producto.cantidad_stock
    );

    if (nuevoStock === null) return;

    try {

      const res = await fetch(
        `http://localhost:3000/productos/${producto.id}`,
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            rol
          },

          body: JSON.stringify({

            nombre: producto.nombre,

            precio: producto.precio,

            cantidad_stock: Number(
              nuevoStock
            )

          })

        }
      );

      if (!res.ok) {

        const error = await res.json();

        alert(
          error.error ||
          "No tienes permisos"
        );

        return;

      }

      cargarProductos();

    } catch (error) {

      console.log(error);

    }

  };

  const eliminarProducto = async (id, nombre) => {

    if (!puedeEditar) {

      alert(
        "No tienes permisos para eliminar productos"
      );

      return;

    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${nombre}"?`
    );

    if (!confirmar) return;

    try {

      const res = await fetch(
        `http://localhost:3000/productos/${id}`,
        {

          method: "DELETE",

          headers: {
            rol
          }

        }
      );

      if (!res.ok) {

        const error = await res.json();

        alert(
          error.error ||
          "No tienes permisos"
        );

        return;

      }

      cargarProductos();

    } catch (error) {

      console.log(error);

    }

  };

  const filteredProductos =
    Array.isArray(productos)

      ? productos.filter((producto) =>

          (producto.nombre || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        )

      : [];

  const totalStock = productos.reduce(
    (sum, p) =>
      sum + Number(p.cantidad_stock || 0),
    0
  );

  const valorTotal = productos.reduce(
    (sum, p) =>
      sum +
      (
        Number(p.precio || 0) *
        Number(p.cantidad_stock || 0)
      ),
    0
  );

  const promedio =
    productos.length > 0
      ? valorTotal / productos.length
      : 0;

  const productosBajoStock =
    productos.filter(
      (p) =>
        Number(p.cantidad_stock) < 5
    );

  return (

    <main className="flex-1 p-8">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Productos
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de productos terminados y recetas
        </p>

      </div>

      {/* BARRA */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 mb-6 flex gap-4">

        <div className="flex-1 relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-200/90 rounded-xl pl-10 py-3 outline-none"
          />

        </div>

        {puedeEditar && (

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 rounded-xl flex items-center gap-2"
          >

            <Plus size={20} />

            Agregar Producto

          </button>

        )}

      </div>

      {/* ALERTA */}
      {productosBajoStock.length > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">

          <div className="flex items-start gap-3">

            <Package
              className="text-red-500 mt-1"
              size={22}
            />

            <div>

              <h3 className="font-bold text-red-700 text-lg">
                Alertas de Inventario
              </h3>

              <p className="text-red-600 text-sm mt-1">

                Hay {
                  productosBajoStock.length
                } producto(s) con bajo stock.

              </p>

            </div>

          </div>

        </div>

      )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Total Productos
          </p>

          <h2 className="text-5xl font-bold">
            {productos.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Unidades en Stock
          </p>

          <h2 className="text-5xl font-bold">
            {totalStock}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Valor Total
          </p>

          <h2 className="text-4xl font-bold">
            ${valorTotal.toFixed(2)}
          </h2>

        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Precio Promedio
          </p>

          <h2 className="text-4xl font-bold">
            ${promedio.toFixed(2)}
          </h2>

        </div>

      </div>

      {/* TABLA */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-white rounded-2xl border border-gray-200/90 overflow-hidden">

          <table className="w-full">

            <thead className="border-b border-gray-200/90 bg-gray-50">

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
                  className={`border-b border-gray-200/90 hover:bg-pink-50 transition ${
                    selectedProducto?.id ===
                    producto.id
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

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        producto.cantidad_stock < 5
                          ? "bg-red-100 text-red-600"
                          : producto.cantidad_stock < 15
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >

                      {producto.cantidad_stock} uds

                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          verProducto(producto)
                        }
                        className="text-purple-500 hover:text-purple-700"
                      >

                        <Eye size={20} />

                      </button>

                      {puedeEditar && (

                        <>
                          <button
                            onClick={() =>
                              editarProducto(producto)
                            }
                            className="text-blue-500"
                          >

                            <Pencil size={20} />

                          </button>

                          <button
                            onClick={() =>
                              eliminarProducto(
                                producto.id,
                                producto.nombre
                              )
                            }
                            className="text-red-500"
                          >

                            <Trash2 size={20} />

                          </button>
                        </>

                      )}

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

                      ingredientesProducto.map(
                        (ingrediente, index) => (

                          <div
                            key={index}
                            className="flex justify-between border-b border-gray-200/90 pb-2"
                          >

                            <span className="font-medium">
                              {ingrediente.nombre}
                            </span>

                            <span className="text-pink-600 font-bold">

                              {ingrediente.cantidad}{" "}
                              {ingrediente.unidad_medida}

                            </span>

                          </div>

                        )
                      )

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

                    {
                      selectedProducto.cantidad_stock
                    } unidades

                  </h3>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

      {/* MODAL */}
      {showModal && puedeEditar && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-2xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Nuevo Producto
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    nombre: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Precio"
                value={nuevoProducto.precio}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    precio: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Cantidad stock"
                value={
                  nuevoProducto.cantidad_stock
                }
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    cantidad_stock:
                      e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="date"
                value={
                  nuevoProducto.fecha_elaboracion
                }
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    fecha_elaboracion:
                      e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="px-5 py-3 rounded-xl border"
              >
                Cancelar
              </button>

              <button
                onClick={agregarProducto}
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}

export default Productos;