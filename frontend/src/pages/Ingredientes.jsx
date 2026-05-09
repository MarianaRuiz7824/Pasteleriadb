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
  const [showModal, setShowModal] = useState(false);
  const [nuevoIngrediente, setNuevoIngrediente] = useState({

  nombre: "",
  unidad_medida: "",
  fecha_caducidad: "",
  precio_por_unidad: "",
  cantidad_stock: ""

});

  useEffect(() => {

    fetch("http://localhost:3000/ingredientes")
      .then((res) => res.json())
      .then((data) => {
        setIngredientes(data);
      });

      

  }, []);

  const editarIngrediente = async (ingrediente) => {

  const nuevoStock = prompt(
    `Nuevo stock para ${ingrediente.nombre}:`,
    ingrediente.cantidad_stock
  );

  if (nuevoStock === null) return;

  try {

    await fetch(
      `http://localhost:3000/ingredientes/${ingrediente.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          nombre: ingrediente.nombre,
          unidad_medida: ingrediente.unidad_medida,
          fecha_caducidad: ingrediente.fecha_caducidad,
          precio_por_unidad: ingrediente.precio_por_unidad,
          cantidad_stock: Number(nuevoStock)

        })

      }
    );

    // RECARGAR TABLA
    const res = await fetch("http://localhost:3000/ingredientes");
    const data = await res.json();

    setIngredientes(data);

  } catch (error) {

    console.log(error);

  }

};

const agregarIngrediente = async () => {

  try {

    const res = await fetch(
      "http://localhost:3000/ingredientes",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          nombre: nuevoIngrediente.nombre,

          unidad_medida:
            nuevoIngrediente.unidad_medida,

          fecha_caducidad:
            nuevoIngrediente.fecha_caducidad,

          precio_por_unidad: Number(
            nuevoIngrediente.precio_por_unidad
          ),

          cantidad_stock: Number(
            nuevoIngrediente.cantidad_stock
          )

        })

      }
    );

    // VER ERROR DEL SERVER
    if (!res.ok) {

      const errorText = await res.text();

      console.log(errorText);

      alert("Error al guardar ingrediente");

      return;

    }

    // RECARGAR TABLA
    const response = await fetch(
      "http://localhost:3000/ingredientes"
    );

    const data = await response.json();

    setIngredientes(data);

    // CERRAR MODAL
    setShowModal(false);

    // LIMPIAR FORMULARIO
    setNuevoIngrediente({

      nombre: "",
      unidad_medida: "",
      fecha_caducidad: "",
      precio_por_unidad: "",
      cantidad_stock: ""

    });

  } catch (error) {

    console.log(error);

  }

};

const eliminarIngrediente = async (id, nombre) => {

  const confirmar = window.confirm(
    `¿Seguro que deseas eliminar "${nombre}"?`
  );

  if (!confirmar) return;

  try {

    await fetch(
      `http://localhost:3000/ingredientes/${id}`,
      {
        method: "DELETE"
      }
    );

    // RECARGAR TABLA
    const res = await fetch(
      "http://localhost:3000/ingredientes"
    );

    const data = await res.json();

    setIngredientes(data);

  } catch (error) {

    console.log(error);

  }

};

  const filteredIngredientes = ingredientes.filter((ing) =>
    ing.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

const ingredientesBajoStock = ingredientes.filter(
  (i) => i.cantidad_stock < 20
);

const ingredientesPorCaducar = ingredientes.filter((i) => {

  const fecha = new Date(i.fecha_caducidad);

  const hoy = new Date();

  const sieteDias = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  return fecha >= hoy && fecha <= sieteDias;

});  

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

        <button
  onClick={() => setShowModal(true)}
  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
>

          <Plus size={20} />

          Agregar Ingrediente

        </button>

      </div>

      {/* ALERTA DINÁMICA */}
{(ingredientesBajoStock.length > 0 ||
  ingredientesPorCaducar.length > 0) && (

  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">

    <div className="flex items-start gap-3">

      <AlertCircle
        className="text-orange-500 mt-1"
        size={22}
      />

      <div>

        <h3 className="font-bold text-orange-700 text-lg">
          Alertas de Inventario
        </h3>

        <p className="text-orange-600 text-sm mt-1">

          {ingredientesBajoStock.length > 0 &&
            `${ingredientesBajoStock.length} ingrediente(s) con bajo stock. `}

          {ingredientesPorCaducar.length > 0 &&
            `${ingredientesPorCaducar.length} próximo(s) a caducar.`}

        </p>

      </div>

    </div>

  </div>

)}

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

                  {new Date(ingrediente.fecha_caducidad) < new Date() ? (

  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

    <AlertCircle size={14} />

    Caducado

  </span>

) : (

  new Date(ingrediente.fecha_caducidad) <
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? (

    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

      <AlertCircle size={14} />

      Por caducar

    </span>

  ) : (

    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">

      ✓ Vigente

    </span>

  )

)}

                </td>

                <td className="p-5">

                  <div className="flex gap-4">

                    <button
  onClick={() => editarIngrediente(ingrediente)}
  className="text-blue-500 hover:scale-110 transition"
>
                      <Edit size={18} />
                    </button>

                    <button
  onClick={() =>
    eliminarIngrediente(
      ingrediente.id,
      ingrediente.nombre
    )
  }
  className="text-red-500 hover:scale-110 transition"
>
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

{/* MODAL */}
{showModal && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-[500px] rounded-2xl p-8">

      <h2 className="text-3xl font-bold mb-6">
        Nuevo Ingrediente
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          value={nuevoIngrediente.nombre}
          onChange={(e) =>
            setNuevoIngrediente({
              ...nuevoIngrediente,
              nombre: e.target.value
            })
          }
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Unidad de medida"
          value={nuevoIngrediente.unidad_medida}
          onChange={(e) =>
            setNuevoIngrediente({
              ...nuevoIngrediente,
              unidad_medida: e.target.value
            })
          }
          className="w-full border rounded-xl p-3"
        />

        <input
          type="date"
          value={nuevoIngrediente.fecha_caducidad}
          onChange={(e) =>
            setNuevoIngrediente({
              ...nuevoIngrediente,
              fecha_caducidad: e.target.value
            })
          }
          className="w-full border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Precio por unidad"
          value={nuevoIngrediente.precio_por_unidad}
          onChange={(e) =>
            setNuevoIngrediente({
              ...nuevoIngrediente,
              precio_por_unidad: e.target.value
            })
          }
          className="w-full border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Cantidad stock"
          value={nuevoIngrediente.cantidad_stock}
          onChange={(e) =>
            setNuevoIngrediente({
              ...nuevoIngrediente,
              cantidad_stock: e.target.value
            })
          }
          className="w-full border rounded-xl p-3"
        />

      </div>

      <div className="flex justify-end gap-4 mt-8">

        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-3 rounded-xl border"
        >
          Cancelar
        </button>

        <button
          onClick={agregarIngrediente}
          className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl"
        >
          Guardar
        </button>

      </div>

    </div>

  </div>

)}
    </div>

  );
}

export default Ingredientes;