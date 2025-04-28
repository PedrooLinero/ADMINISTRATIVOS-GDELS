/**
 * @fileoverview Archivo principal del servidor backend.
 * Configura y arranca el servidor utilizando Express.
 */

// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");
// Importar gestores de rutas
const departamentoRoutes = require("./routes/departamentoRoutes"); // Corregir el nombre
const tareasRoutes = require("./routes/tareasRoutes");
const operariosRoutes = require("./routes/operariosRoutes");

// Importar configuración
const config = require("./config/config");

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());
// Configurar CORS para admitir cualquier origen
app.use(cors());

// Configurar rutas de la API Rest
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/operarios", operariosRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Backend de Administrativos GDELS funcionando!");
});

/**
 * Inicia el servidor solo si no estamos en modo de prueba.
 * @param {number} port - El puerto en el que el servidor escuchará.
 */
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
}

// Exportamos la aplicación para poder hacer pruebas
module.exports = app;