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
import { apiUrl } from "../config";

function PantallaInicio() {
  const [departamentoId, setDepartamentoId] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [esOtraTarea, setEsOtraTarea] = useState(false);
  const [descripcionOtraTarea, setDescripcionOtraTarea] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [operario, setOperario] = useState("");
  const [operarioError, setOperarioError] = useState("");
  const [cantidades, setCantidades] = useState(""); // Nuevo estado para cantidades
  const [cantidadesError, setCantidadesError] = useState(""); // Error para cantidades
  const [tiempo, setTiempo] = useState(""); // Nuevo estado para tiempo
  const [tiempoError, setTiempoError] = useState(""); // Error para tiempo
  const [registros, setRegistros] = useState([]); // Estado para almacenar todos los registros
  const [tiempoTotal, setTiempoTotal] = useState(0); // Tiempo acumulado

  const JORNADA_TOTAL_MINUTOS = 460; // Máximo de minutos por jornada

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
          setDepartamentos(data.datos);
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
          let response = await fetch(`${apiUrl}/tareas/departamento/${departamentoId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            let data = await response.json();
            setTareas(data.datos || []);
          } else {
            setTareas([]);
            console.error("No se encontraron tareas para el departamento");
          }
        } catch (error) {
          console.error("Error al obtener tareas:", error);
          setTareas([]);
        }
      } else {
        setTareas([]);
      }
    }

    getTareas();
  }, [departamentoId]);

  // Manejar el cambio del departamento seleccionado
  const handleDepartamentoChange = (event) => {
    setDepartamentoId(event.target.value);
    setTarea("");
    setEsOtraTarea(false);
    setDescripcionOtraTarea("");
    setDescripcionError("");
  };

  // Manejar el cambio de la tarea seleccionada
  const handleTareaChange = (event) => {
    const tareaId = event.target.value;
    setTarea(tareaId);

    const tareaSeleccionada = tareas.find((t) => t.id === tareaId);
    if (tareaSeleccionada && tareaSeleccionada.es_otra_tarea) {
      setEsOtraTarea(true);
    } else {
      setEsOtraTarea(false);
      setDescripcionOtraTarea("");
      setDescripcionError("");
    }
  };

  // Manejar el cambio de la descripción de "otra tarea"
  const handleDescripcionChange = (event) => {
    const value = event.target.value;
    setDescripcionOtraTarea(value);

    if (esOtraTarea && value.trim() === "") {
      setDescripcionError("La descripción es obligatoria para esta tarea");
    } else {
      setDescripcionError("");
    }
  };

  // Manejar el cambio del operario
  const handleOperarioChange = (event) => {
    const value = event.target.value;
    setOperario(value);

    if (value.length > 4) {
      setOperarioError("El código de operario debe tener máximo 4 caracteres");
    } else {
      setOperarioError("");
    }
  };

  // Manejar el cambio de cantidades gestionadas
  const handleCantidadesChange = (event) => {
    const value = event.target.value;
    // Permitir solo números enteros
    if (/^\d*$/.test(value)) {
      setCantidades(value);
      if (value === "" || parseInt(value) <= 0) {
        setCantidadesError("Debe introducir un número mayor que 0");
      } else {
        setCantidadesError("");
      }
    }
  };

  // Manejar el cambio del tiempo empleado
  const handleTiempoChange = (event) => {
    const value = event.target.value;
    // Permitir solo números enteros
    if (/^\d*$/.test(value)) {
      setTiempo(value);
      const tiempoNum = parseInt(value) || 0;
      const nuevoTiempoTotal = tiempoTotal + tiempoNum;

      if (value === "" || tiempoNum <= 0) {
        setTiempoError("Debe introducir un número mayor que 0");
      } else if (nuevoTiempoTotal > JORNADA_TOTAL_MINUTOS) {
        setTiempoError(
          `El tiempo total no puede exceder ${JORNADA_TOTAL_MINUTOS} minutos (restante: ${
            JORNADA_TOTAL_MINUTOS - tiempoTotal
          } minutos)`
        );
      } else {
        setTiempoError("");
      }
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    // Validar el operario
    if (operario.length > 4) {
      setOperarioError("El código de operario debe tener máximo 4 caracteres");
      return;
    }

    // Validar la descripción si es "otra tarea"
    if (esOtraTarea && descripcionOtraTarea.trim() === "") {
      setDescripcionError("La descripción es obligatoria para esta tarea");
      return;
    }

    // Validar cantidades
    const cantidadesNum = parseInt(cantidades) || 0;
    if (cantidades === "" || cantidadesNum <= 0) {
      setCantidadesError("Debe introducir un número mayor que 0");
      return;
    }

    // Validar tiempo
    const tiempoNum = parseInt(tiempo) || 0;
    const nuevoTiempoTotal = tiempoTotal + tiempoNum;
    if (tiempo === "" || tiempoNum <= 0) {
      setTiempoError("Debe introducir un número mayor que 0");
      return;
    }
    if (nuevoTiempoTotal > JORNADA_TOTAL_MINUTOS) {
      setTiempoError(
        `El tiempo total no puede exceder ${JORNADA_TOTAL_MINUTOS} minutos (restante: ${
          JORNADA_TOTAL_MINUTOS - tiempoTotal
        } minutos)`
      );
      return;
    }

    // Datos a enviar
    const datos = {
      departamentoId,
      tarea,
      operario,
      cantidades: cantidadesNum,
      tiempo: tiempoNum,
    };
    if (esOtraTarea) {
      datos.descripcionOtraTarea = descripcionOtraTarea;
    }

    // Agregar el registro al array de registros
    setRegistros([...registros, datos]);
    setTiempoTotal(nuevoTiempoTotal);

    console.log("Registro enviado:", datos);
    console.log("Registros totales:", [...registros, datos]);
    console.log("Tiempo total acumulado:", nuevoTiempoTotal);

    // Limpiar los campos después del envío
    setOperario("");
    setTarea("");
    setEsOtraTarea(false);
    setDescripcionOtraTarea("");
    setDescripcionError("");
    setCantidades("");
    setCantidadesError("");
    setTiempo("");
    setTiempoError("");
  };

  // Función para finalizar la jornada
  const handleFinalizarJornada = () => {
    console.log("Jornada finalizada. Registros finales:", registros);
    console.log("Tiempo total acumulado:", tiempoTotal);
    // Aquí puedes redirigir al usuario o mostrar un mensaje de finalización
    alert(
      `Jornada finalizada con un total de ${tiempoTotal} minutos registrados.`
    );
    // Reiniciar el formulario
    setRegistros([]);
    setTiempoTotal(0);
    setDepartamentoId("");
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

      {/* Mostrar tiempo acumulado y restante */}
      <Typography
        variant="h6"
        sx={{ textAlign: "center", marginBottom: "20px" }}
      >
        Tiempo acumulado: {tiempoTotal} minutos | Tiempo restante:{" "}
        {Math.max(0, JORNADA_TOTAL_MINUTOS - tiempoTotal)} minutos
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
          disabled={tiempoTotal >= JORNADA_TOTAL_MINUTOS}
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

      {/* Select de tareas */}
      <FormControl
        fullWidth
        sx={{ marginBottom: "20px" }}
        disabled={!departamentoId || tiempoTotal >= JORNADA_TOTAL_MINUTOS}
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
              {tarea.nombre_tarea}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Campo para la descripción de "otra tarea" (condicional) */}
      {esOtraTarea && (
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <TextField
            id="descripcion-input"
            label="Descripción de la Tarea"
            variant="outlined"
            value={descripcionOtraTarea}
            onChange={handleDescripcionChange}
            multiline
            rows={3}
            error={!!descripcionError}
            helperText={descripcionError || "Explique la tarea realizada"}
            disabled={tiempoTotal >= JORNADA_TOTAL_MINUTOS}
          />
        </FormControl>
      )}

      {/* Campo para introducir operario */}
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField
          id="operario-input"
          label="Código de Operario"
          variant="outlined"
          value={operario}
          onChange={handleOperarioChange}
          inputProps={{ maxLength: 4 }}
          error={!!operarioError}
          helperText={operarioError || "Introduzca máximo 4 caracteres"}
          disabled={tiempoTotal >= JORNADA_TOTAL_MINUTOS}
        />
      </FormControl>

      {/* Campo para introducir cantidades gestionadas */}
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField
          id="cantidades-input"
          label="Cantidades Gestionadas"
          variant="outlined"
          value={cantidades}
          onChange={handleCantidadesChange}
          type="text"
          error={!!cantidadesError}
          helperText={cantidadesError || "Introduzca un número entero"}
          disabled={tiempoTotal >= JORNADA_TOTAL_MINUTOS}
        />
      </FormControl>

      {/* Campo para introducir tiempo empleado */}
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <TextField
          id="tiempo-input"
          label="Tiempo Empleado (minutos)"
          variant="outlined"
          value={tiempo}
          onChange={handleTiempoChange}
          type="text"
          error={!!tiempoError}
          helperText={
            tiempoError ||
            `Introduzca un número entero (máximo restante: ${
              JORNADA_TOTAL_MINUTOS - tiempoTotal
            } minutos)`
          }
          disabled={tiempoTotal >= JORNADA_TOTAL_MINUTOS}
        />
      </FormControl>

      {/* Botones */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={
            !departamentoId ||
            !tarea ||
            !operario ||
            !!operarioError ||
            (esOtraTarea && !descripcionOtraTarea.trim()) ||
            !!cantidadesError ||
            !!tiempoError ||
            tiempoTotal >= JORNADA_TOTAL_MINUTOS
          }
        >
          Guardar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleFinalizarJornada}
          disabled={registros.length === 0}
        >
          Finalizar Jornada
        </Button>
      </Box>

      {/* Resumen de registros (opcional) */}
      {registros.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">Registros Enviados:</Typography>
          {registros.map((registro, index) => (
            <Typography key={index} variant="body2">
              - Tarea {registro.tarea} (Depto: {registro.departamentoId}) | Operario: {registro.operario} | Cantidades: {registro.cantidades} | Tiempo: {registro.tiempo} min
              {registro.descripcionOtraTarea && ` | Descripción: ${registro.descripcionOtraTarea}`}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PantallaInicio;