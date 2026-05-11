import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  Table
} from "lucide-react";

function Clientes() {

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showTabla, setShowTabla] = useState(false);

  const [editando, setEditando] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({

    id: "",
    nombre: "",
    edad: "",
    telefono: "",
    email: ""

  });

  const rol = localStorage.getItem("rol");

  const puedeEditar =
    rol === "admin";

  useEffect(() => {

    obtenerClientes();

  }, []);

  const obtenerClientes = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/clientes",
        {
          headers: {
            rol: localStorage.getItem("rol")
          }
        }
      );

      const data = await res.json();

      setClientes(Array.isArray(data) ? data : []);

    } catch (error) {

      console.log(error);

      setClientes([]);

    }

  };

  const agregarCliente = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/clientes",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            rol: localStorage.getItem("rol")
          },

          body: JSON.stringify({

            nombre: nuevoCliente.nombre,
            edad: Number(nuevoCliente.edad),
            telefono: nuevoCliente.telefono,
            email: nuevoCliente.email

          })

        }
      );

      if (!res.ok) {

        alert("No tienes permisos");

        return;

      }

      obtenerClientes();

      setShowModal(false);

      limpiarFormulario();

    } catch (error) {

      console.log(error);

    }

  };

  const editarCliente = async () => {

    try {

      const res = await fetch(
        `http://localhost:3000/clientes/${nuevoCliente.id}`,
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            rol: localStorage.getItem("rol")
          },

          body: JSON.stringify({

            nombre: nuevoCliente.nombre,
            edad: Number(nuevoCliente.edad),
            telefono: nuevoCliente.telefono,
            email: nuevoCliente.email

          })

        }
      );

      if (!res.ok) {

        alert("No tienes permisos");

        return;

      }

      obtenerClientes();

      setShowModal(false);

      setEditando(false);

      limpiarFormulario();

    } catch (error) {

      console.log(error);

    }

  };

  const eliminarCliente = async (id) => {

    const confirmar = confirm(
      "¿Eliminar cliente?"
    );

    if (!confirmar) return;

    try {

      const res = await fetch(
        `http://localhost:3000/clientes/${id}`,
        {

          method: "DELETE",

          headers: {
            rol: localStorage.getItem("rol")
          }

        }
      );

      if (!res.ok) {

        alert("No tienes permisos");

        return;

      }

      obtenerClientes();

    } catch (error) {

      console.log(error);

    }

  };

  const abrirEditar = (cliente) => {

    if (!puedeEditar) return;

    setNuevoCliente(cliente);

    setEditando(true);

    setShowModal(true);

  };

  const limpiarFormulario = () => {

    setNuevoCliente({

      id: "",
      nombre: "",
      edad: "",
      telefono: "",
      email: ""

    });

  };

  const filteredClientes = Array.isArray(clientes)

    ? clientes.filter((cliente) =>

        (cliente.nombre || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (cliente.email || "")
          .toLowerCase()
          .includes(search.toLowerCase())

      )

    : [];

  return (

    <main className="flex-1 p-8">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Clientes
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de clientes de la pastelería
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
            placeholder="Buscar clientes por nombre o email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-200/90 rounded-xl pl-10 py-3 outline-none"
          />

        </div>

        <button
          onClick={() => setShowTabla(true)}
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 rounded-xl flex items-center gap-2"
        >

          <Table size={20} />

          Ver Tabla

        </button>

        {puedeEditar && (

          <button
            onClick={() => {

              limpiarFormulario();

              setEditando(false);

              setShowModal(true);

            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 rounded-xl flex items-center gap-2"
          >

            <Plus size={20} />

            Agregar Cliente

          </button>

        )}

      </div>

      {/* ESTADISTICAS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        {/* TOTAL CLIENTES */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Total Clientes
          </p>

          <h2 className="text-5xl font-bold">
            {clientes.length}
          </h2>

        </div>

        {/* TOTAL PEDIDOS */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Total Pedidos
          </p>

          <h2 className="text-5xl font-bold">
            {clientes.reduce(
              (acc, cliente) =>
                acc + Number(cliente.total_pedidos || 0),
              0
            )}
          </h2>

        </div>

        {/* PEDIDOS POR CLIENTE */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Pedidos por Cliente
          </p>

          <h2 className="text-5xl font-bold">

            {clientes.length > 0

              ? (

                  clientes.reduce(

                    (acc, cliente) =>
                      acc + Number(cliente.total_pedidos || 0),

                    0

                  ) / clientes.length

                ).toFixed(1)

              : "0.0"}

          </h2>

        </div>

        {/* CLIENTES ACTIVOS */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6">

          <p className="text-gray-500 mb-2">
            Clientes Activos
          </p>

          <h2 className="text-5xl font-bold text-green-500">
            {clientes.length}
          </h2>

        </div>

      </div>

      {/* CARDS CLIENTES */}
      <div className="grid grid-cols-3 gap-6">

        {filteredClientes.map((cliente) => (

          <div
            key={cliente.id}
            className="bg-white rounded-2xl border border-gray-200/90 p-6"
          >

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-purple-100 p-4 rounded-2xl">

                <User
                  className="text-purple-600"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {cliente.nombre}
                </h2>

                <p className="text-purple-500">
                  Cliente #{cliente.id}
                </p>

              </div>

            </div>

            <div className="space-y-3 text-gray-600">

              <div className="flex items-center gap-2">

                <Mail size={18} />

                {cliente.email}

              </div>

              <div className="flex items-center gap-2">

                <Phone size={18} />

                {cliente.telefono}

              </div>

              <div className="flex items-center gap-2">

                <Calendar size={18} />

                Edad: {cliente.edad} años

              </div>

            </div>

            <div className="border-t border-gray-200/90 mt-6 pt-4 space-y-2">

              <div className="flex justify-between">

                <span>Total pedidos</span>

                <span className="font-bold">
                  {cliente.total_pedidos || 0}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Cliente desde</span>

                <span>
                  {cliente.fecha_alta?.slice(0, 10)}
                </span>

              </div>

            </div>

            {puedeEditar && (

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() =>
                    abrirEditar(cliente)
                  }
                  className="flex-1 border border-purple-500 text-purple-500 hover:bg-purple-50 py-3 rounded-xl flex justify-center items-center gap-2"
                >

                  <Pencil size={18} />

                  Editar

                </button>

                <button
                  onClick={() =>
                    eliminarCliente(cliente.id)
                  }
                  className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl flex justify-center items-center gap-2"
                >

                  <Trash2 size={18} />

                  Eliminar

                </button>

              </div>

            )}

          </div>

        ))}

      </div>

      {/* MODAL FORM */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[600px] rounded-2xl p-8">

            <h2 className="text-3xl font-bold mb-6">

              {editando
                ? "Editar Cliente"
                : "Nuevo Cliente"}

            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nombre"
                value={nuevoCliente.nombre}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    nombre: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Edad"
                value={nuevoCliente.edad}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    edad: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={nuevoCliente.telefono}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    telefono: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="email"
                placeholder="Email"
                value={nuevoCliente.email}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    email: e.target.value
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
                onClick={
                  editando
                    ? editarCliente
                    : agregarCliente
                }
                className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-xl"
              >

                {editando
                  ? "Guardar Cambios"
                  : "Agregar Cliente"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* MODAL TABLA */}
      {showTabla && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[1000px] rounded-2xl p-8 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold">
                Tabla Completa de Clientes
              </h2>

              <button
                onClick={() =>
                  setShowTabla(false)
                }
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
              >
                Cerrar
              </button>

            </div>

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-100">

                  <th className="border p-3">ID</th>
                  <th className="border p-3">Nombre</th>
                  <th className="border p-3">Edad</th>
                  <th className="border p-3">Teléfono</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Pedidos</th>
                  <th className="border p-3">Fecha Alta</th>

                </tr>

              </thead>

              <tbody>

                {clientes.map((cliente) => (

                  <tr key={cliente.id}>

                    <td className="border p-3">
                      {cliente.id}
                    </td>

                    <td className="border p-3">
                      {cliente.nombre}
                    </td>

                    <td className="border p-3">
                      {cliente.edad}
                    </td>

                    <td className="border p-3">
                      {cliente.telefono}
                    </td>

                    <td className="border p-3">
                      {cliente.email}
                    </td>

                    <td className="border p-3">
                      {cliente.total_pedidos || 0}
                    </td>

                    <td className="border p-3">
                      {cliente.fecha_alta?.slice(0,10)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </main>

  );

}

export default Clientes;