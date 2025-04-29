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
import { useEffect, useState } from "react";
import { apiUrl } from "../config"; // Asegúrate de que la ruta sea correcta

function PantallaInicio() {
  const [departamentoId, setDepartamentoId] = useState(""); // Estado para el ID del departamento seleccionado
  const [departamentos, setDepartamentos] = useState([]); // Estado para los departamentos cargados
  const [tareas, setTareas] = useState([]); // Estado para las tareas cargadas
  const [tarea, setTarea] = useState(""); // Estado para la tarea seleccionada
  const [operario, setOperario] = useState(""); // Estado para el operario
  const [operarioError, setOperarioError] = useState(""); // Estado para errores de validación

  // Cargar departamentos al montar el componente
  useEffect(() => {
    async function getDepartamentos() {
      try {
        let response = await fetch(`${apiUrl}/departamentos`, {
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

  // Cargar tareas cuando cambie el departamento seleccionado
  useEffect(() => {
    async function getTareas() {
      if (departamentoId) {
        try {
          let response = await fetch(
            `${apiUrl}/tareas/departamento/${departamentoId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            let data = await response.json();
            setTareas(data.datos); // Asumiendo que las tareas vienen en `data.datos`
          } else {
            setTareas([]); // Limpiar tareas si no hay datos
            console.error("No se encontraron tareas para el departamento");
          }
        } catch (error) {
          console.error("Error al obtener tareas:", error);
          setTareas([]);
        }
      } else {
        setTareas([]); // Limpiar tareas si no hay departamento seleccionado
      }
    }

    getTareas();
  }, [departamentoId]);

  // Manejar el cambio del departamento seleccionado
  const handleDepartamentoChange = (event) => {
    setDepartamentoId(event.target.value);
    setTarea(""); // Reiniciar la tarea seleccionada al cambiar el departamento
  };

  // Manejar el cambio de la tarea seleccionada
  const handleTareaChange = (event) => {
    setTarea(event.target.value);
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
      departamentoId,
      tarea,
      operario,
    });

    // Limpiar los campos después del envío
    setOperario("");
    setTarea("");
  };

  return (
    <Box sx={{ padding: "16px" }}>
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
          value={departamentoId}
          label="Departamento"
          onChange={handleDepartamentoChange}
        >
          <MenuItem value="">
            <em>Seleccione un departamento</em>
          </MenuItem>
          {departamentos.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
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

      {/* Select de tareas */}
      <FormControl
        fullWidth
        sx={{ marginBottom: "20px" }}
        disabled={!departamentoId}
      >
        <InputLabel id="tarea-select-label">Tarea</InputLabel>
        <Select
          labelId="tarea-select-label"
          id="tarea-select"
          value={tarea}
          label="Tarea"
          onChange={handleTareaChange}
        >
          <MenuItem value="">
            <em>Seleccione una tarea</em>
          </MenuItem>
          {tareas.map((tarea) => (
            <MenuItem key={tarea.id} value={tarea.id}>
              {tarea.nombre_tarea}{" "}
              {/* Cambia tarea.nombre por tarea.nombre_tarea */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botón para enviar */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!departamentoId || !tarea || !operario || !!operarioError}
      >
        Guardar
      </Button>
    </Box>
  );
}

export default PantallaInicio;
