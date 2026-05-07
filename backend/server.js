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

app.listen(3000, () => {
  console.log("Servidor corriendo");
});