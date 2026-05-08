const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({

  user: "postgres",
  host: "localhost",
  database: "Pasteleriadb",
  password: "1234",
  port: 5432,

});

app.get("/productos", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM productos"
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error);
  }

});

app.get("/productos/:id/ingredientes", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(

      `
      SELECT
        ingredientes.nombre,
        productos_ingredientes.cantidad,
        ingredientes.unidad_medida

      FROM productos_ingredientes

      JOIN ingredientes
      ON ingredientes.id = productos_ingredientes.id_ingrediente

      WHERE productos_ingredientes.id_producto = $1
      `,
      
      [id]

    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});

  app.get("/ingredientes", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM ingredientes"
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }
});

app.get("/productos/:id/ingredientes", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        ingredientes.nombre,
        productos_ingredientes.cantidad,
        ingredientes.unidad_medida

      FROM productos_ingredientes

      JOIN ingredientes
      ON ingredientes.id = productos_ingredientes.id_ingrediente

      WHERE productos_ingredientes.id_producto = $1
      `,
      [id]
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});

app.get("/pedidos", async (req, res) => {

  try {

    const result = await pool.query(`

      SELECT
        pedidos.id,

        cliente.nombre AS cliente_nombre,
        cliente.telefono AS cliente_telefono,
        cliente.email AS cliente_email,

        empleado.nombre AS empleado_nombre,

        empleados.posicion,

        pedidos.fecha_solicitud,
        pedidos.fecha_entrega,
        pedidos.comentarios

      FROM pedidos

      JOIN clientes
        ON clientes.id = pedidos.id_cliente

      JOIN personas cliente
        ON cliente.id = clientes.id

      JOIN empleados
        ON empleados.id = pedidos.id_empleado

      JOIN personas empleado
        ON empleado.id = empleados.id

      ORDER BY pedidos.id;

    `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});

app.get("/pedidos/:id/productos", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(`

      SELECT
        productos.nombre,
        productos.precio,
        pedidos_productos.cantidad,

        (productos.precio * pedidos_productos.cantidad)
        AS subtotal

      FROM pedidos_productos

      JOIN productos
        ON productos.id = pedidos_productos.id_producto

      WHERE pedidos_productos.id_pedido = $1

    `, [id]);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});

app.listen(3000, () => {
  console.log("Servidor corriendo");
  console.log("ESTE SERVER SI SE ESTA EJECUTANDO");
});