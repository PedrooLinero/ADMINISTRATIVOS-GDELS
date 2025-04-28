-- Crear la tabla departamento
CREATE TABLE departamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Crear la tabla operarios (relacionada con departamento)
CREATE TABLE operarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(4) NOT NULL,
    id_departamento INT NOT NULL,
    FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

-- Crear la tabla tareas (para tareas regulares y otras tareas)
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_departamento INT NOT NULL,
    nombre_tarea VARCHAR(100) NOT NULL,
    es_otra_tarea BOOLEAN DEFAULT FALSE, -- Para distinguir entre tareas regulares y "otras tareas"
    FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

-- Insertar los 5 departamentos mencionados
INSERT INTO departamento (nombre) VALUES 
('Recepción'),
('Stock'),
('Despachos'),
('Expediciones'),
('Arnedo');

-- Insertar algunos operarios de ejemplo para cada departamento
INSERT INTO operarios (codigo, id_departamento) VALUES 
('1234', 1), -- Operario para Recepción
('5678', 2), -- Operario para Stock
('9012', 3), -- Operario para Despachos
('3456', 4), -- Operario para Expediciones
('7890', 5); -- Operario para Arnedo

-- Insertar las tareas para cada departamento
-- Departamento Recepción
INSERT INTO tareas (id_departamento, nombre_tarea, es_otra_tarea) VALUES 
(1, 'Registros Rf', FALSE),
(1, 'Prealbaranar', FALSE),
(1, 'Inspe 2', FALSE),
(1, 'Inspe 3', FALSE),
(1, 'Entregas A Terceros', FALSE),
(1, 'Entregas Vía Urgente', FALSE),
(1, 'Pr Por Mantener', FALSE),
(1, 'Apertura De Incidencia Baan', FALSE),
(1, 'Incidencias Rápida', FALSE),
(1, 'Comunicación Y Entregas De Códigos Genéricos', FALSE),
(1, 'Generar Tránsito', FALSE),
(1, 'Gestión Documental', FALSE),
(1, 'Otras Tareas', TRUE);

-- Departamento Stock
INSERT INTO tareas (id_departamento, nombre_tarea, es_otra_tarea) VALUES 
(2, 'Preparación Picking', FALSE),
(2, 'Atender Urgencias Gdels', FALSE),
(2, 'Insuficiencias Expediciones', FALSE),
(2, 'Recuentos De Códigos', FALSE),
(2, 'Recuento Cíclico', FALSE),
(2, 'Gestión Reacs', FALSE),
(2, 'Inspe 2', FALSE),
(2, 'Inspe 3', FALSE),
(2, 'Inspe 5', FALSE),
(2, 'Regularización Stock', FALSE),
(2, 'Gestión Revisa/recaduca', FALSE),
(2, 'Aflorar/re Bajar Artículos', FALSE),
(2, 'Gestión Documental', FALSE),
(2, 'Otras Tareas', TRUE);

-- Departamento Despachos
INSERT INTO tareas (id_departamento, nombre_tarea, es_otra_tarea) VALUES 
(3, 'Rebaje Kanban', FALSE),
(3, 'Rebaje Gasoil', FALSE),
(3, 'Kanban', FALSE),
(3, 'Sacar Ejecución', FALSE),
(3, 'Traspaso De Proyecto', FALSE),
(3, 'Gestión Documental', FALSE),
(3, 'Rebaje De Ejecuciones', FALSE),
(3, 'Dar Alternativas Insuficiencias', FALSE),
(3, 'Otras Tareas', TRUE);

-- Departamento Expediciones
INSERT INTO tareas (id_departamento, nombre_tarea, es_otra_tarea) VALUES 
(4, 'Albaranes Manuales', FALSE),
(4, 'Plantillas', FALSE),
(4, 'Cargas', FALSE),
(4, 'Reac', FALSE),
(4, 'Firma/calidad/transporte', FALSE),
(4, 'Alternativas', FALSE),
(4, 'Cotejo', FALSE),
(4, 'Actualizar Seguimiento (ob)', FALSE),
(4, 'Packing', FALSE),
(4, 'Poner En Enviados (rebajar)', FALSE),
(4, 'Transportistas', FALSE),
(4, 'Gestión Documental', FALSE),
(4, 'Otras Tareas', TRUE);

-- Departamento Arnedo
INSERT INTO tareas (id_departamento, nombre_tarea, es_otra_tarea) VALUES 
(5, 'Atender Urgencias Gdels', FALSE),
(5, 'Insuficiencias Expediciones', FALSE),
(5, 'Recuentos De Códigos', FALSE),
(5, 'Recuento Cíclico', FALSE),
(5, 'Gestión Reacs', FALSE),
(5, 'Inspe 3', FALSE),
(5, 'Inspe 5', FALSE),
(5, 'Otras Tareas', TRUE);