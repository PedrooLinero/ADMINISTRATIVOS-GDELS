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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [cantidades, setCantidades] = useState("");
  const [cantidadesError, setCantidadesError] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [tiempoError, setTiempoError] = useState("");
  const [registros, setRegistros] = useState([]);
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  const JORNADA_TOTAL_MINUTOS = 460;

  // Carga inicial de departamentos
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/departamentos`);
        if (!res.ok) throw new Error();
        const { datos } = await res.json();
        setDepartamentos(datos);
      } catch {
        setErrorMessage("Error al cargar departamentos");
      }
    })();
  }, []);

  // Carga tareas según departamento
  useEffect(() => {
    setTareas([]);
    if (!departamentoId) return;
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/tareas/departamento/${departamentoId}`);
        if (!res.ok) throw new Error();
        const { datos } = await res.json();
        setTareas(datos || []);
      } catch {
        setErrorMessage("Error al cargar tareas");
      }
    })();
  }, [departamentoId]);

  // Abre modal al llegar al límite de tiempo
  useEffect(() => {
    if (tiempoTotal >= JORNADA_TOTAL_MINUTOS) {
      setModalAbierto(true);
    }
  }, [tiempoTotal]);

  // Limpia solo los campos del formulario (sin afectar al tiempoTotal ni al operario)
  const limpiarCamposFormulario = () => {
    setDepartamentoId("");
    setTarea("");
    setEsOtraTarea(false);
    setDescripcionOtraTarea("");
    setDescripcionError("");
    // Operario se mantiene hasta que se cierre modal tras completar jornada
    setCantidades("");
    setCantidadesError("");
    setTiempo("");
    setTiempoError("");
    setErrorMessage("");
  };

  // Limpia todo al cerrar modal (incluido operario y tiempoTotal)
  const limpiarTodoAlFinal = () => {
    limpiarCamposFormulario();
    setOperario("");
    setOperarioError("");
    setTiempoTotal(0);
    setRegistros([]);
  };

  const handleModalCerrar = () => {
    setModalAbierto(false);
    limpiarTodoAlFinal();
  };

  // Función de envío al backend y registro local
  const handleSubmit = async () => {
    setErrorMessage("");
    // Validaciones en orden
    if (!departamentoId) return setErrorMessage("Seleccione un departamento");
    if (!operario || operario.length > 4) return setOperarioError("Entre 1 y 4 caracteres");
    if (!tarea) return setErrorMessage("Seleccione una tarea");
    if (esOtraTarea && !descripcionOtraTarea.trim()) return setDescripcionError("Descripción obligatoria");
    const cNum = parseInt(cantidades) || 0;
    if (!cNum) return setCantidadesError("Debe ser > 0");
    const tNum = parseInt(tiempo) || 0;
    if (!tNum) return setTiempoError("Debe ser > 0");
    if (tiempoTotal + tNum > JORNADA_TOTAL_MINUTOS)
      return setTiempoError(`Restan ${JORNADA_TOTAL_MINUTOS - tiempoTotal} minutos`);

    // Envío
    try {
      await fetch(`${apiUrl}/shift/save-shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operario,
          departamento: departamentos.find(d => d.id === departamentoId)?.nombre,
          tarea: tareas.find(t => t.id === tarea)?.nombre_tarea,
          cantidades: cNum,
          tiempo: tNum,
          descripcion: descripcionOtraTarea || "",
        }),
      });
      setTiempoTotal(prev => prev + tNum);
      setRegistros(prev => [...prev, { departamentoId, tarea, operario, cantidades: cNum, tiempo: tNum, descripcionOtraTarea }]);
      limpiarCamposFormulario();
    } catch {
      setErrorMessage("Error al guardar el registro");
    }
  };

  const handleDownloadExcel = () => {
    window.open(`${apiUrl}/shift/download-excel`, "_blank");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" align="center" mb={2}>
        Bienvenido a la Administración GDELS
      </Typography>
      <Typography align="center" mb={2}>
        Tiempo acumulado: {tiempoTotal} min | Restan: {Math.max(0, JORNADA_TOTAL_MINUTOS - tiempoTotal)} min
      </Typography>
      {errorMessage && (
        <Typography color="error" align="center" mb={2}>
          {errorMessage}
        </Typography>
      )}

      {/* Departamento */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={departamentoId}
          label="Departamento"
          onChange={e => { setDepartamentoId(e.target.value); setErrorMessage(""); }}
          disabled={modalAbierto}
        >
          <MenuItem value=""><em>Seleccione</em></MenuItem>
          {departamentos.map(d => (
            <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Operario */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Código de Operario"
          value={operario}
          onChange={e => { setOperario(e.target.value); setOperarioError(""); }}
          error={!!operarioError}
          helperText={operarioError || "Máx. 4 caracteres"}
          inputProps={{ maxLength: 4 }}
          disabled={!departamentoId || modalAbierto}
        />
      </FormControl>

      {/* Tarea */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!operario || modalAbierto}>
        <InputLabel>Tarea</InputLabel>
        <Select
          value={tarea}
          label="Tarea"
          onChange={e => {
            const id = e.target.value;
            setTarea(id);
            const sel = tareas.find(t => t.id === id);
            setEsOtraTarea(!!sel?.es_otra_tarea);
            setErrorMessage("");
          }}
        >
          <MenuItem value=""><em>Seleccione</em></MenuItem>
          {tareas.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.nombre_tarea}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Descripción otra tarea (opcional) */}
      {esOtraTarea && (
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Descripción de la Tarea"
          value={descripcionOtraTarea}
          onChange={e => { setDescripcionOtraTarea(e.target.value); setErrorMessage(""); }}
          error={!!descripcionError}
          helperText={descripcionError}
          disabled={modalAbierto}
          sx={{ mb: 2 }}
        />
      )}

      {/* Cantidades */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Cantidades Gestionadas"
          value={cantidades}
          onChange={e => { const v = e.target.value.replace(/\D/g, ""); setCantidades(v); setErrorMessage(""); }}
          error={!!cantidadesError}
          helperText={cantidadesError}
          disabled={!tarea || modalAbierto}
        />
      </FormControl>

      {/* Tiempo */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          label="Tiempo Empleado (min)"
          value={tiempo}
          onChange={e => { const v = e.target.value.replace(/\D/g, ""); setTiempo(v); setErrorMessage(""); }}
          error={!!tiempoError}
          helperText={tiempoError}
          disabled={!cantidades || modalAbierto}
        />
      </FormControl>

      {/* Botones */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSubmit}
          disabled={modalAbierto}
        >
          Guardar
        </Button>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleDownloadExcel}
          disabled={modalAbierto}
        >
          Descargar Excel
        </Button>
      </Box>

      {/* Modal al finalizar jornada */}
      <Dialog open={modalAbierto} onClose={handleModalCerrar}>
        <DialogTitle>¡Jornada finalizada!</DialogTitle>
        <DialogContent>
          <Typography>No quedan minutos disponibles. No puedes realizar más tareas.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalCerrar}>Entendido</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PantallaInicio;
