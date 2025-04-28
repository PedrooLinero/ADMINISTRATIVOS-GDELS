import * as React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";
import { useEffect } from "react";
import { apiUrl } from "../config"; // Asegúrate de que la ruta sea correcta

function PantallaInicio() {
  const [departamento, setDepartamento] = React.useState(""); // Estado para el departamento seleccionado
  const [departamentos, setDepartamentos] = React.useState([]); // Estado para los departamentos cargados
  const [operario, setOperario] = React.useState(""); // Estado para el operario
  const [operarioError, setOperarioError] = React.useState(""); // Estado para errores de validación

  useEffect(() => {
    async function getDepartamentos() {
      try {
        let response = await fetch(apiUrl + "/departamentos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          let data = await response.json();
          setDepartamentos(data.datos); // Asumiendo que los datos vienen en `data.datos`
        }
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    }

    getDepartamentos();
  }, []);

  // Manejar el cambio del departamento seleccionado
  const handleChange = (event) => {
    setDepartamento(event.target.value);
  };

  // Manejar el cambio del operario
  const handleOperarioChange = (event) => {
    const value = event.target.value;
    setOperario(value);

    // Validar que no exceda 4 caracteres
    if (value.length > 4) {
      setOperarioError("El código de operario debe tener máximo 4 caracteres");
    } else {
      setOperarioError("");
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (operario.length > 4) {
      setOperarioError("El código de operario debe tener máximo 4 caracteres");
      return;
    }

    // Aquí puedes añadir la lógica para enviar los datos al backend
    console.log("Datos a enviar:", {
      departamento,
      operario,
    });

    // Limpiar el campo después del envío
    setOperario("");
  };

  return (
    <Box sx={{ padding: "16px" }}>
      {/* Barra de navegación */}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      ></Box>

      {/* Título */}
      <Typography
        variant="h4"
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        Bienvenido a la Administración GDELS
      </Typography>

      {/* Select de departamentos */}
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel id="departamento-select-label">Departamento</InputLabel>
        <Select
          labelId="departamento-select-label"
          id="departamento-select"
          value={departamento}
          label="Departamento"
          onChange={handleChange} // Manejar el cambio del departamento
        >
          {departamentos.map((dep) => (
            <MenuItem key={dep.id} value={dep.nombre}>
              {dep.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Campo para introducir operario */}
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField
          id="operario-input"
          label="Código de Operario"
          variant="outlined"
          value={operario}
          onChange={handleOperarioChange}
          inputProps={{ maxLength: 4 }} // Limita la entrada a 4 caracteres
          error={!!operarioError}
          helperText={operarioError || "Introduzca máximo 4 caracteres"}
        />
      </FormControl>

      {/* Botón para enviar */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!departamento || !operario || !!operarioError}
      >
        Guardar
      </Button>
    </Box>
  );
}

export default PantallaInicio;
