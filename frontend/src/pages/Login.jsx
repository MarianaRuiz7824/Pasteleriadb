import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

function Login() {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = () => {

    // ADMIN
    if (
      usuario === "admin" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "rol",
        "admin"
      );

      navigate("/");

      return;
    }

    // EMPLEADO VENTAS
    if (
      usuario === "ventas" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "rol",
        "empleado_ventas"
      );

      navigate("/");

      return;
    }

    // INVENTARIO
    if (
      usuario === "inventario" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "rol",
        "empleado_inventario"
      );

      navigate("/");

      return;
    }

    // EMPLEADO NORMAL
    if (
      usuario === "empleado" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "rol",
        "empleado_normal"
      );

      navigate("/");

      return;
    }

    // CLIENTE
    if (
      usuario === "cliente" &&
      password === "1234"
    ) {

      localStorage.setItem(
        "rol",
        "cliente"
      );

      navigate("/");

      return;
    }

    alert("Usuario o contraseña incorrectos");

  };

  return (

    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">

      <div className="bg-white w-[450px] rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold text-center mb-2">
          Pastelería
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Iniciar sesión
        </p>

        <div className="space-y-5">

          <div className="relative">

            <User
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
              className="w-full border rounded-xl pl-12 py-4 outline-none"
            />

          </div>

          <div className="relative">

            <Lock
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-xl pl-12 py-4 outline-none"
            />

          </div>

          <button
            onClick={iniciarSesion}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl text-lg font-semibold"
          >

            Entrar

          </button>

        </div>

        <div className="mt-8 text-sm text-gray-500 space-y-1">

          <p>admin / 1234</p>
          <p>ventas / 1234</p>
          <p>inventario / 1234</p>
          <p>empleado / 1234</p>
          <p>cliente / 1234</p>

        </div>

      </div>

    </div>

  );

}

export default Login;