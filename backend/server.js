const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pools = {

  admin: new Pool({
    user: "admin_user",
    host: "localhost",
    database: "Pasteleriadb",
    password: "1234",
    port: 5432,
  }),

  empleado_ventas: new Pool({
    user: "ventas_user",
    host: "localhost",
    database: "Pasteleriadb",
    password: "1234",
    port: 5432,
  }),

  empleado_inventario: new Pool({
    user: "inventario_user",
    host: "localhost",
    database: "Pasteleriadb",
    password: "1234",
    port: 5432,
  }),

  empleado_normal: new Pool({
    user: "normal_user",
    host: "localhost",
    database: "Pasteleriadb",
    password: "1234",
    port: 5432,
  }),

  cliente: new Pool({
    user: "cliente_user",
    host: "localhost",
    database: "Pasteleriadb",
    password: "1234",
    port: 5432,
  }),

};

const obtenerPool = (req) => {

  const rol = req.headers["rol"];

  return pools[rol] || pools.cliente;

};



/* ======================================================
   PRODUCTOS
====================================================== */

app.get("/productos", async (req, res) => {

  try {
const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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

    const pool = obtenerPool(req);
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
   EMPLEADOS
====================================================== */

app.get("/empleados", async (req, res) => {

  try {

    const pool = obtenerPool(req);
const result = await pool.query(`

      SELECT
        empleados.id,
        personas.nombre,
        personas.edad,
        personas.telefono,
        personas.email,
        personas.fecha_alta,
        empleados.posicion,
        empleados.salario_mensual

      FROM empleados

      INNER JOIN personas
      ON personas.id = empleados.id

      ORDER BY empleados.id

    `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});


/* ======================================================
   AGREGAR EMPLEADO
====================================================== */

app.post("/empleados", async (req, res) => {

  try {

    const {
      nombre,
      edad,
      telefono,
      email,
      posicion,
      salario_mensual
    } = req.body;

    // INSERTAR EN PERSONAS
    const personaResult = await pool.query(

      `
      INSERT INTO personas
      (
        nombre,
        edad,
        telefono,
        email
      )

      VALUES ($1,$2,$3,$4)

      RETURNING *
      `,

      [
        nombre,
        edad,
        telefono,
        email
      ]

    );

    const persona = personaResult.rows[0];

    // INSERTAR EN EMPLEADOS
    const empleadoResult = await pool.query(

      `
      INSERT INTO empleados
      (
        id,
        posicion,
        salario_mensual
      )

      VALUES ($1,$2,$3)

      RETURNING *
      `,

      [
        persona.id,
        posicion,
        salario_mensual
      ]

    );

    res.json({
      persona,
      empleado: empleadoResult.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});


/* ======================================================
   EDITAR EMPLEADO
====================================================== */

app.put("/empleados/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      edad,
      telefono,
      email,
      posicion,
      salario_mensual
    } = req.body;

    // ACTUALIZAR PERSONA
    await pool.query(

      `
      UPDATE personas
      SET
        nombre = $1,
        edad = $2,
        telefono = $3,
        email = $4

      WHERE id = $5
      `,

      [
        nombre,
        edad,
        telefono,
        email,
        id
      ]

    );

    // ACTUALIZAR EMPLEADO
    await pool.query(

      `
      UPDATE empleados
      SET
        posicion = $1,
        salario_mensual = $2

      WHERE id = $3
      `,

      [
        posicion,
        salario_mensual,
        id
      ]

    );

    res.json({
      mensaje: "Empleado actualizado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});


/* ======================================================
   ELIMINAR EMPLEADO
====================================================== */

app.delete("/empleados/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // Eliminar empleado
    await pool.query(
      "DELETE FROM empleados WHERE id = $1",
      [id]
    );

    // Eliminar persona
    await pool.query(
      "DELETE FROM personas WHERE id = $1",
      [id]
    );

    res.json({
      mensaje: "Empleado eliminado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ======================================================
   CLIENTES
====================================================== */

app.get("/clientes", async (req, res) => {

  try {
const pool = obtenerPool(req);
const result = await pool.query(`

  SELECT
    clientes.id,
    personas.nombre,
    personas.edad,
    personas.telefono,
    personas.email,
    personas.fecha_alta,

    COUNT(pedidos.id_cliente)::int
    AS total_pedidos

  FROM clientes

  INNER JOIN personas
    ON personas.id = clientes.id

  LEFT JOIN pedidos
    ON pedidos.id_cliente = clientes.id

  GROUP BY
    clientes.id,
    personas.nombre,
    personas.edad,
    personas.telefono,
    personas.email,
    personas.fecha_alta

  ORDER BY clientes.id

`);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});


/* ======================================================
   AGREGAR CLIENTE
====================================================== */

app.post("/clientes", async (req, res) => {

  try {

    const {
      nombre,
      edad,
      telefono,
      email
    } = req.body;

    // INSERTAR PERSONA
    const personaResult = await pool.query(

      `
      INSERT INTO personas
      (
        nombre,
        edad,
        telefono,
        email
      )

      VALUES ($1,$2,$3,$4)

      RETURNING *
      `,

      [
        nombre,
        edad,
        telefono,
        email
      ]

    );

    const persona = personaResult.rows[0];

    // INSERTAR CLIENTE
    const clienteResult = await pool.query(

      `
      INSERT INTO clientes
      (
        id
      )

      VALUES ($1)

      RETURNING *
      `,

      [persona.id]

    );

    res.json({
      persona,
      cliente: clienteResult.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});


/* ======================================================
   EDITAR CLIENTE
====================================================== */

app.put("/clientes/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      edad,
      telefono,
      email
    } = req.body;

    await pool.query(

      `
      UPDATE personas
      SET
        nombre = $1,
        edad = $2,
        telefono = $3,
        email = $4

      WHERE id = $5
      `,

      [
        nombre,
        edad,
        telefono,
        email,
        id
      ]

    );

    res.json({
      mensaje: "Cliente actualizado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});


/* ======================================================
   ELIMINAR CLIENTE
====================================================== */

app.delete("/clientes/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // ELIMINAR CLIENTE
    await pool.query(
      "DELETE FROM clientes WHERE id = $1",
      [id]
    );

    // ELIMINAR PERSONA
    await pool.query(
      "DELETE FROM personas WHERE id = $1",
      [id]
    );

    res.json({
      mensaje: "Cliente eliminado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

});

/* ======================================================
   CAMBIAR ESTADO PEDIDO
====================================================== */

app.put("/pedidos/:id/estado", async (req, res) => {

  try {

    const pool = obtenerPool(req);

    const { id } = req.params;

    const { estado } = req.body;

    const result = await pool.query(

      `
      UPDATE pedidos
      SET estado = $1
      WHERE id = $2
      RETURNING *
      `,

      [estado, id]

    );

    res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});

/* ======================================================
   INICIAR SERVIDOR
====================================================== */

app.listen(3000, () => {

  console.log("Servidor corriendo en puerto 3000");

});