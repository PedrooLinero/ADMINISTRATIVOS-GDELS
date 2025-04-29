/**
 * @fileoverview Archivo principal del servidor backend.
 * Configura y arranca el servidor utilizando Express.
 */

const express = require("express");
const cors = require("cors");
const departamentoRoutes = require("./routes/departamentoRoutes");
const tareasRoutes = require("./routes/tareasRoutes");
const operariosRoutes = require("./routes/operariosRoutes");
const shiftRoutes = require("./routes/shiftRoutes"); // Importar las nuevas rutas
const config = require("./config/config");

const app = express();

// 1) JSON parser
app.use(express.json());

// 2) CORS configurado UNA sola vez, ANTES de las rutas
app.use(cors({
  origin: "http://localhost:5173", // tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false // <- desactivamos cookies / credenciales
}));

// 3) Rutas de la API
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/operarios", operariosRoutes);
app.use("/api/shift", shiftRoutes); // Montar las rutas de shiftRoutes con el prefijo /api/shift

app.get("/", (req, res) => {
  res.send("¡Backend de Administrativos GDELS funcionando!");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
}

module.exports = app;