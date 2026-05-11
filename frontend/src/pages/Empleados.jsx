import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  Pencil,
  Trash2
} from "lucide-react";

function Empleados() {

  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({

    nombre: "",
    edad: "",
    telefono: "",
    email: "",
    posicion: "",
    salario_mensual: ""

  });

  useEffect(() => {

    obtenerEmpleados();

  }, []);

  const obtenerEmpleados = async () => {

    const res = await fetch(
      "http://localhost:3000/empleados"
    );

    const data = await res.json();

    setEmpleados(data);

  };

  const agregarEmpleado = async () => {

    try {

      await fetch(
        "http://localhost:3000/empleados",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            nombre: nuevoEmpleado.nombre,
            edad: Number(nuevoEmpleado.edad),
            telefono: nuevoEmpleado.telefono,
            email: nuevoEmpleado.email,
            posicion: nuevoEmpleado.posicion,
            salario_mensual: Number(
              nuevoEmpleado.salario_mensual
            )

          })

        }
      );

      obtenerEmpleados();

      setShowModal(false);

      limpiarFormulario();

    } catch (error) {

      console.log(error);

    }

  };

  const editarEmpleado = async () => {

    try {

      await fetch(
        `http://localhost:3000/empleados/${nuevoEmpleado.id}`,
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            nombre: nuevoEmpleado.nombre,
            edad: Number(nuevoEmpleado.edad),
            telefono: nuevoEmpleado.telefono,
            email: nuevoEmpleado.email,
            posicion: nuevoEmpleado.posicion,
            salario_mensual: Number(
              nuevoEmpleado.salario_mensual
            )

          })

        }
      );

      obtenerEmpleados();

      setShowModal(false);

      setEditando(false);

      limpiarFormulario();

    } catch (error) {

      console.log(error);

    }

  };

  const eliminarEmpleado = async (id) => {

    const confirmar = confirm(
      "¿Eliminar empleado?"
    );

    if (!confirmar) return;

    try {

      await fetch(
        `http://localhost:3000/empleados/${id}`,
        {
          method: "DELETE"
        }
      );

      obtenerEmpleados();

    } catch (error) {

      console.log(error);

    }

  };

  const abrirEditar = (empleado) => {

    setNuevoEmpleado(empleado);

    setEditando(true);

    setShowModal(true);

  };

  const limpiarFormulario = () => {

    setNuevoEmpleado({

      nombre: "",
      edad: "",
      telefono: "",
      email: "",
      posicion: "",
      salario_mensual: ""

    });

  };

  const filteredEmpleados = Array.isArray(empleados)

  ? empleados.filter((empleado) =>

      (empleado.nombre || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (empleado.posicion || "")
        .toLowerCase()
        .includes(search.toLowerCase())

    )

  : [];

  return (

    <main className="flex-1 p-8">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Empleados
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de empleados de la pastelería
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
            placeholder="Buscar empleados..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl pl-10 py-3 outline-none"
          />

        </div>

        <button
          onClick={() => {

            limpiarFormulario();

            setEditando(false);

            setShowModal(true);

          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-xl flex items-center gap-2"
        >

          <Plus size={20} />

          Agregar Empleado

        </button>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6">

        {filteredEmpleados.map((empleado) => (

          <div
            key={empleado.id}
            className="bg-white rounded-2xl border p-6"
          >

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-blue-100 p-4 rounded-2xl">

                <User
                  className="text-blue-600"
                  size={28}
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {empleado.nombre}
                </h2>

                <p className="text-blue-500">
                  {empleado.posicion}
                </p>

              </div>

            </div>

            <div className="space-y-3 text-gray-600">

              <div className="flex items-center gap-2">

                <Mail size={18} />

                {empleado.email}

              </div>

              <div className="flex items-center gap-2">

                <Phone size={18} />

                {empleado.telefono}

              </div>

            </div>

            <div className="border-t mt-6 pt-4 space-y-2">

              <div className="flex justify-between">

                <span>Salario</span>

                <span className="font-bold">
                  ${empleado.salario_mensual}
                </span>

              </div>

              <div className="flex justify-between">

                <span>Edad</span>

                <span>{empleado.edad} años</span>

              </div>

              <div className="flex justify-between">

                <span>Fecha Alta</span>

                <span>
                  {empleado.fecha_alta?.slice(0, 10)}
                </span>

              </div>

            </div>

            <div className="flex gap-4 mt-6">

              <button
                onClick={() =>
                  abrirEditar(empleado)
                }
                className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-xl flex justify-center items-center gap-2"
              >

                <Pencil size={18} />

                Editar

              </button>

              <button
                onClick={() =>
                  eliminarEmpleado(empleado.id)
                }
                className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl flex justify-center items-center gap-2"
              >

                <Trash2 size={18} />

                Eliminar

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[600px] rounded-2xl p-8">

            <h2 className="text-3xl font-bold mb-6">

              {editando
                ? "Editar Empleado"
                : "Nuevo Empleado"}

            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nombre"
                value={nuevoEmpleado.nombre}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    nombre: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Edad"
                value={nuevoEmpleado.edad}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    edad: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={nuevoEmpleado.telefono}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    telefono: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="email"
                placeholder="Email"
                value={nuevoEmpleado.email}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    email: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Posición"
                value={nuevoEmpleado.posicion}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    posicion: e.target.value
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="number"
                placeholder="Salario"
                value={nuevoEmpleado.salario_mensual}
                onChange={(e) =>
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    salario_mensual: e.target.value
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
                    ? editarEmpleado
                    : agregarEmpleado
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl"
              >

                {editando
                  ? "Guardar Cambios"
                  : "Agregar Empleado"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );

}

export default Empleados;