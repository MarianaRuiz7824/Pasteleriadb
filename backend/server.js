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



/* ======================================================
   PRODUCTOS
====================================================== */

app.get("/productos", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM productos ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   AGREGAR PRODUCTO
====================================================== */

app.post("/productos", async (req, res) => {

  try {

    const {
      nombre,
      precio,
      cantidad_stock,
      fecha_elaboracion
    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO productos
      (
        nombre,
        precio,
        cantidad_stock,
        fecha_elaboracion,
        alerta_stock
      )

      VALUES ($1,$2,$3,$4,$5)

      RETURNING *
      `,

      [
        nombre,
        precio,
        cantidad_stock,
        fecha_elaboracion,
        cantidad_stock < 5
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

/* ======================================================
   EDITAR PRODUCTO
====================================================== */

app.put("/productos/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      precio,
      cantidad_stock
    } = req.body;

    const result = await pool.query(

      `
      UPDATE productos
      SET
        nombre = $1,
        precio = $2,
        cantidad_stock = $3,
        alerta_stock = ($3 < 5)

      WHERE id = $4

      RETURNING *
      `,

      [
        nombre,
        precio,
        cantidad_stock,
        id
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   ELIMINAR PRODUCTO
====================================================== */

app.delete("/productos/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM productos WHERE id = $1",
      [id]
    );

    res.json({
      mensaje: "Producto eliminado"
    });

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   INGREDIENTES DE PRODUCTO
====================================================== */

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



/* ======================================================
   INGREDIENTES
====================================================== */

app.get("/ingredientes", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM ingredientes ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

  }

});

/* ======================================================
   EDITAR INGREDIENTE
====================================================== */

app.put("/ingredientes/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      unidad_medida,
      fecha_caducidad,
      precio_por_unidad,
      cantidad_stock
    } = req.body;

    const result = await pool.query(

      `
      UPDATE ingredientes
      SET
        nombre = $1,
        unidad_medida = $2,
        fecha_caducidad = $3,
        precio_por_unidad = $4,
        cantidad_stock = $5,
        alerta_stock = ($5 < 3)

      WHERE id = $6

      RETURNING *
      `,

      [
        nombre,
        unidad_medida,
        fecha_caducidad,
        precio_por_unidad,
        cantidad_stock,
        id
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   AGREGAR INGREDIENTE
====================================================== */

app.post("/ingredientes", async (req, res) => {

  try {

    const {
      nombre,
      unidad_medida,
      fecha_caducidad,
      precio_por_unidad,
      cantidad_stock
    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO ingredientes
      (
        nombre,
        unidad_medida,
        fecha_caducidad,
        precio_por_unidad,
        cantidad_stock,
        alerta_stock
      )

      VALUES ($1,$2,$3,$4,$5,$6)

      RETURNING *
      `,

      [
        nombre,
        unidad_medida,
        fecha_caducidad,
        precio_por_unidad,
        cantidad_stock,
        cantidad_stock < 3
      ]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   ELIMINAR INGREDIENTE
====================================================== */

app.delete("/ingredientes/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM ingredientes WHERE id = $1",
      [id]
    );

    res.json({
      mensaje: "Ingrediente eliminado"
    });

  } catch (error) {

    console.log(error);

  }

});



/* ======================================================
   PEDIDOS
====================================================== */

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
        pedidos.comentarios,
        pedidos.estado

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

app.post("/pedidos", async (req, res) => {

  try {

    const {
      id_cliente,
      id_empleado,
      fecha_solicitud,
      fecha_entrega,
      comentarios,
      productos
    } = req.body;

    // CREAR PEDIDO
    const pedidoResult = await pool.query(

      `
      INSERT INTO pedidos
      (
        id_cliente,
        id_empleado,
        fecha_solicitud,
        fecha_entrega,
        comentarios
      )

      VALUES ($1,$2,$3,$4,$5)

      RETURNING *
      `,

      [
        id_cliente,
        id_empleado,
        fecha_solicitud,
        fecha_entrega,
        comentarios
      ]

    );

    const pedido = pedidoResult.rows[0];

    // INSERTAR PRODUCTOS DEL PEDIDO
    for (const producto of productos) {

      await pool.query(

        `
        INSERT INTO pedidos_productos
        (
          id_pedido,
          id_producto,
          cantidad
        )

        VALUES ($1,$2,$3)
        `,

        [
          pedido.id,
          producto.id_producto,
          producto.cantidad
        ]

      );

    }

    res.json(pedido);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

/* ======================================================
   PRODUCTOS DE PEDIDO
====================================================== */

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

/* ======================================================
   INICIAR SERVIDOR
====================================================== */

app.listen(3000, () => {

  console.log("Servidor corriendo en puerto 3000");

});