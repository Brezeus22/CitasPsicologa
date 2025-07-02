<<<<<<< HEAD
function ocultarSecciones() {
  document.getElementById('principal-botones').style.display = 'none';
  document.getElementById('pendientes-seccion').style.display = 'none';
  document.getElementById('historial-seccion').style.display = 'none';
  document.getElementById('editar-perfil-seccion').style.display = 'none';
  document.getElementById('pacientes-seccion').style.display = 'none';
  document.getElementById('historial-paciente-seccion').style.display = 'none';
  document.getElementById('horario-seccion').style.display = 'none';
  document.getElementById('informe-medico-seccion').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  // Menú desplegable
  const menuToggle = document.getElementById('menu-toggle');
  const menuList = document.getElementById('menu-list');
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function(e) {
    if (!menuToggle.contains(e.target) && !menuList.contains(e.target)) {
      menuList.style.display = 'none';
    }
  });

  // Menú usuario 
  const userDropdown = document.getElementById('user-dropdown');
  const userIconBtn = document.getElementById('user-icon-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (userIconBtn && userDropdown && userDropdownMenu) {
    userIconBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!userDropdown.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });
  }

  // Mostrar botones principales
  function mostrarInicio() {
    ocultarSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
  }

  // Botones principales
  document.getElementById('btn-pendientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });

  // Menú lateral
  document.getElementById('menu-inicio').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarInicio();
  });
  document.getElementById('menu-pendientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });
  document.getElementById('menu-pacientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });

  // Editar perfil
  document.getElementById('editar-perfil').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('principal-botones').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById('editar-perfil-seccion').style.display = 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
    document.getElementById('pregunta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').value = '';
  });

  // Desplegar usuario/correo
  document.getElementById('btn-desplegar-usuario').addEventListener('click', function() {
    const div = document.getElementById('desplegable-usuario');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  // Desplegar contraseña
  document.getElementById('btn-desplegar-contrasena').addEventListener('click', function() {
    const div = document.getElementById('desplegable-contrasena');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  // Desplegar pregunta de seguridad
  document.getElementById('btn-desplegar-seguridad').addEventListener('click', function() {
    const div = document.getElementById('desplegable-seguridad');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
  });

  // Cambiar tipo de cambio (usuario/correo)
  document.getElementById('tipo-cambio-usuario').addEventListener('change', function() {
    const inputUsuario = document.getElementById('nuevo-usuario');
    const inputCorreo = document.getElementById('nuevo-correo');
    if (this.value === 'usuario') {
      inputUsuario.style.display = 'block';
      inputCorreo.style.display = 'none';
    } else if (this.value === 'correo') {
      inputUsuario.style.display = 'none';
      inputCorreo.style.display = 'block';
    } else {
      inputUsuario.style.display = 'none';
      inputCorreo.style.display = 'none';
    }
  });

  // Cancelar edición de perfil
  document.getElementById('cancelar-editar-perfil').addEventListener('click', function() {
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('principal-botones').style.display = 'flex';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
    document.getElementById('pregunta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').value = '';
  });

  // Guardar cambios de perfil
  document.getElementById('guardar-cambios-perfil').addEventListener('click', function() {
    const usuario = document.getElementById('nuevo-usuario').value.trim();
    const correo = document.getElementById('nuevo-correo').value.trim();
    const pass1 = document.getElementById('nueva-contrasena').value;
    const pass2 = document.getElementById('confirmar-contrasena').value;
    const mensaje = document.getElementById('mensaje-contrasena');
    const pregunta = document.getElementById('pregunta-seguridad');
    const respuesta = document.getElementById('respuesta-seguridad');

    // Validación de contraseña
    if (
      document.getElementById('desplegable-contrasena').style.display === 'block' &&
      (pass1 || pass2)
    ) {
      if (!pass1) {
        mensaje.textContent = 'Ingrese la nueva contraseña.';
        mensaje.style.display = 'block';
        return;
      }
      if (!pass2) {
        mensaje.textContent = 'Por favor, confirme la nueva contraseña.';
        mensaje.style.display = 'block';
        return;
      }
      if (pass1 !== pass2) {
        mensaje.textContent = 'Las contraseñas no coinciden.';
        mensaje.style.display = 'block';
        return;
      }
    }

    // Validación de pregunta de seguridad
    if (document.getElementById('desplegable-seguridad').style.display === 'block') {
      if (!pregunta.value) {
        alert('Seleccione una pregunta de seguridad.');
        return;
      }
      if (!respuesta.value.trim()) {
        alert('Ingrese la respuesta de seguridad.');
        return;
      }
    }

    mensaje.style.display = 'none';
    alert('Cambios guardados correctamente.');
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('principal-botones').style.display = 'flex';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    pregunta.value = '';
    respuesta.value = '';
  });

  // Ejemplo de datos de citas pendientes
  const citasPendientes = [
    {
      fecha: '2025-06-25',
      hora: '10:00 AM',
      paciente: 'Juan Pérez',
      cedula: '12345678',
      categoria: 'Psicoterapia Individual',
      modalidad: 'presencial',
      pago: 'Pago móvil',
      estado: 'En Espera'
    },
    {
      fecha: '2025-06-28',
      hora: '07:00 PM',
      paciente: 'Ana Gómez',
      pago: 'Pago móvil',
      estado: 'En Espera'
    },
    {
      fecha: '2025-06-28',
      hora: '07:00 PM',
      paciente: 'Ana Gómez',
      cedula: '87654321', 
      categoria: 'Psicoterapia Infantil',
      pago: 'Transferencias',
      modalidad: 'online',
      estado: 'En Espera'
    }
  ];

  // --- MODAL REPROGRAMAR ---
  let citaAReprogramar = null;

  function abrirModalReprogramar(idx) {
    citaAReprogramar = idx;
    modalidadReprogramar = citasPendientes[idx].modalidad || 'presencial';
    document.getElementById('modal-reprogramar').style.display = 'flex';
    document.getElementById('nueva-fecha').value = '';
    document.getElementById('nueva-hora').innerHTML = '<option value="">Seleccione</option>';
    document.getElementById('nota-reprogramar').value = '';
  }

  function cerrarModalReprogramar() {
    document.getElementById('modal-reprogramar').style.display = 'none';
    citaAReprogramar = null;
  }

  // --- HORARIOS Y FECHAS DISPONIBLES SEGÚN MODALIDAD PARA REPROGRAMAR ---
  const horariosReservados = {
    '2025-06-13': ['09:00 AM', '06:00 PM'],
    '2025-06-14': ['10:00 AM'],
  };

  function generarTodasLasHoras() {
    const horas = [];
    for (let h = 9; h <= 20; h++) {
      horas.push({ h, m: 0 });
      if (h !== 20) horas.push({ h, m: 30 });
    }
    return horas;
  }

  function formatoHora(h, m) {
    let sufijo = h < 12 ? 'AM' : 'PM';
    let hora12 = h % 12;
    if (hora12 === 0) hora12 = 12;
    return (
      (hora12 < 10 ? '0' : '') + hora12 + ':' + (m === 0 ? '00' : '30') + ' ' + sufijo
    );
  }

  function esHoraPermitida(modalidad, diaSemana, h, m) {
    if (modalidad === 'presencial') {
      if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a viernes: 9:00-12:00 y 13:00-16:00
        if ((h >= 9 && h < 12) || (h >= 13 && h < 16)) return true;
      } else if (diaSemana === 6) {
        // Sábado: 9:00-13:00
        if (h >= 9 && h < 13) return true;
      }
    } else if (modalidad === 'online') {
      if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a viernes: 6:00pm-8:00pm
        if (h >= 18 && h <= 20) return true;
      } else if (diaSemana === 6) {
        // Sábado: 4:00pm-7:00pm
        if (h >= 16 && h <= 19) return true;
      }
    }
    return false;
  }

  function getDayOfWeek(dateString) {
    // 0: domingo, 1: lunes, ..., 6: sábado
    return new Date(dateString).getDay();
  }

  // Cambia el evento de fecha para usar la modalidad correcta y mostrar horas válidas
  document.getElementById('nueva-fecha').addEventListener('change', function() {
    const fechaVal = this.value;
    const selectHora = document.getElementById('nueva-hora');
    selectHora.innerHTML = '<option value="">Seleccione</option>';
    if (!fechaVal) return;
    const diaSemana = getDayOfWeek(fechaVal);
    const modalidad = modalidadReprogramar; // viene de la cita seleccionada
    const todasHoras = generarTodasLasHoras();
    const reservados = horariosReservados[fechaVal] || [];

    if (diaSemana === 0) {
      selectHora.innerHTML = '<option value="">Horario no laborable</option>';
      selectHora.disabled = true;
      return;
    }
    selectHora.disabled = false;

    todasHoras.forEach(({ h, m }) => {
      const horaStr = formatoHora(h, m);
      const option = document.createElement('option');
      option.value = horaStr;
      option.textContent = horaStr;

      if (!esHoraPermitida(modalidad, diaSemana, h, m)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (cerrado)';
      } else if (reservados.includes(horaStr)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (reservado)';
      }
      selectHora.appendChild(option);
    });
  });

  // Validar si selecciona un horario reservado o cerrado en el modal
  document.getElementById('nueva-hora').addEventListener('change', function() {
    const fechaVal = document.getElementById('nueva-fecha').value;
    const diaSemana = getDayOfWeek(fechaVal);
    const modalidad = modalidadReprogramar;
    const valor = this.value;
    const reservados = horariosReservados[fechaVal] || [];

    let partes = valor.match(/^(\d+):(\d+) (AM|PM)$/);
    let h = 0, m = 0;
    if (partes) {
      h = parseInt(partes[1], 10);
      m = parseInt(partes[2], 10);
      if (partes[3] === 'PM' && h !== 12) h += 12;
      if (partes[3] === 'AM' && h === 12) h = 0;
    }

    if (diaSemana === 0 || !esHoraPermitida(modalidad, diaSemana, h, m)) {
      alert('Cerrado');
      this.value = '';
    } else if (reservados.includes(valor)) {
      alert('Reservado');
      this.value = '';
    }
  });

  // Mostrar modal al hacer clic en reprogramar
  function mostrarPendientes() {
    const contenedor = document.getElementById('tabla-pendientes');
    if (!contenedor) return;
    if (citasPendientes.length === 0) {
      contenedor.innerHTML = '<tr><td colspan="9">No hay citas pendientes.</td></tr>';
      return;
    }
    let html = `
      <tr>
        <th style="min-width:100px;"></th>
        <th style="min-width:80px;">Hora</th>
        <th style="min-width:150px;">Paciente</th>
        <th style="min-width:100px;">Cédula</th> <!-- NUEVA COLUMNA -->
        <th style="min-width:120px;">Categoría</th>
        <th style="min-width:100px;">Modalidad</th>
        <th style="min-width:110px;">Pago</th>
        <th style="min-width:110px;">Estado</th>
        <th style="min-width:420px;">Acciones</th>
      </tr>
    `;
    citasPendientes.forEach((cita, idx) => {
      html += `
  <tr>
    <td>${cita.fecha}</td>
    <td>${cita.hora}</td>
    <td>${cita.paciente}</td>
    <td>${cita.cedula || ''}</td> <!-- NUEVA COLUMNA -->
    <td>${cita.categoria}</td>
    <td>${cita.modalidad === 'presencial' ? 'Presencial' : 'Online'}</td>
    <td>${cita.pago}</td>
    <td>${cita.estado}</td>
    <td>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button class="btn-confirmar" data-idx="${idx}">Confirmar</button>
        <button class="btn-reprogramar" data-idx="${idx}">Reprogramar</button>
        <button class="btn-informe" data-idx="${idx}">Informe médico</button>
        <button class="btn-historial" data-idx="${idx}">
          <i class="fa-solid fa-notes-medical"></i> Historial clínico
        </button>
      </div>
    </td>
  </tr>
`;
    });
    contenedor.innerHTML = html;

    // Acciones
    contenedor.querySelectorAll('.btn-confirmar').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        citasPendientes[idx].estado = 'Confirmada';
        mostrarPendientes();
      });
    });
    contenedor.querySelectorAll('.btn-reprogramar').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        abrirModalReprogramar(idx);
      });
    });

    // Listener para historial clínico
    contenedor.querySelectorAll('.btn-historial').forEach(btn => {
  btn.addEventListener('click', function() {
    const idx = this.getAttribute('data-idx');
    if (idx !== null) window.verHistorialPaciente(Number(idx));
  });
});

    // Listener para informe médico
    contenedor.querySelectorAll('.btn-informe').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        if (idx !== null) {
          mostrarInformeMedicoPaciente(Number(idx)); // <--- ESTA ES LA FUNCIÓN CORRECTA
        }
      });
    });
  }

  // Cerrar modal reprogramar
  document.getElementById('cerrar-modal-reprogramar').onclick = cerrarModalReprogramar;
  document.getElementById('cancelar-reprogramar').onclick = cerrarModalReprogramar;

  // Guardar reprogramación
  document.getElementById('form-reprogramar').addEventListener('submit', function(e) {
    e.preventDefault();
    if (citaAReprogramar !== null) {
      const nuevaFecha = document.getElementById('nueva-fecha').value;
      const nuevaHora = document.getElementById('nueva-hora').value;
      const nota = document.getElementById('nota-reprogramar').value;
      citasPendientes[citaAReprogramar].fecha = nuevaFecha;
      citasPendientes[citaAReprogramar].hora = nuevaHora;
      citasPendientes[citaAReprogramar].nota = nota;
      citasPendientes[citaAReprogramar].estado = 'Reprogramada';
      mostrarPendientes();
      cerrarModalReprogramar();
    }
  });

  // Simulación de datos llenados por el paciente (puedes adaptar para cada paciente)
  const historialesPacientes = [
    {
      motivo_consulta: "Ansiedad y estrés laboral",
      sintomas: "Insomnio, irritabilidad, dificultad para concentrarse",
      episodios_previos: "Sí, hace 2 años",
      tiempo_problema: "3 meses",
      desencadenantes: "Cambio de trabajo, aumento de responsabilidades",
      tratamientos_previos: "Ninguno",
      auto_descripcion: "Responsable, perfeccionista, algo ansioso",
      antecedentes_familiares: "Padre con antecedentes de ansiedad",
      desarrollo_psicomotor: "Normal",
      escolaridad: "Universidad completa",
      problemas_afectivos: "Ninguno",
      vida_laboral: "Empleado estable",
      relaciones_interpersonales: "Buenas",
      conducta_sexual: "Sin problemas",
      sumario_diagnostico: "Trastorno de ansiedad generalizada",
      evaluacion_psicologica: "Evaluación dentro de parámetros normales",
      tratamiento: "Terapia cognitivo-conductual",
      evolucion: "Mejoría progresiva",
      cargo_responsable: "Psicólogo clínico",
      universidad_responsable: "Universidad Central"
    },
    {
      motivo_consulta: "Problemas de concentración",
      sintomas: "Olvidos frecuentes, distracción",
      episodios_previos: "No",
      tiempo_problema: "1 mes",
      desencadenantes: "Estrés académico",
      tratamientos_previos: "Ninguno",
      auto_descripcion: "Estudiosa, responsable",
      antecedentes_familiares: "Sin antecedentes",
      desarrollo_psicomotor: "Normal",
      escolaridad: "Secundaria",
      problemas_afectivos: "Ansiedad leve",
      vida_laboral: "Estudiante",
      relaciones_interpersonales: "Pocas amistades",
      conducta_sexual: "Sin actividad",
      sumario_diagnostico: "Dificultad de atención",
      evaluacion_psicologica: "Requiere seguimiento",
      tratamiento: "Técnicas de estudio y relajación",
      evolucion: "En proceso",
      cargo_responsable: "Psicóloga escolar",
      universidad_responsable: "Universidad Nacional"
    }
  ];

  function abrirModalHistorial(idx) {
    const datos = historialesPacientes[idx] || {};
    const preguntas = [
      { label: "Motivo de la consulta", key: "motivo_consulta" },
      { label: "Síntomas", key: "sintomas" },
      { label: "¿Ha tenido episodios previos similares?", key: "episodios_previos" },
      { label: "¿Desde hace cuánto tiempo presenta el problema?", key: "tiempo_problema" },
      { label: "Desencadenantes identificados", key: "desencadenantes" },
      { label: "Tratamientos previos", key: "tratamientos_previos" },
      { label: "¿Cómo se describe usted mismo/a?", key: "auto_descripcion" },
      { label: "Antecedentes familiares relevantes", key: "antecedentes_familiares" },
      { label: "Desarrollo psicomotor", key: "desarrollo_psicomotor" },
      { label: "Escolaridad", key: "escolaridad" },
      { label: "Problemas afectivos", key: "problemas_afectivos" },
      { label: "Vida laboral", key: "vida_laboral" },
      { label: "Relaciones interpersonales", key: "relaciones_interpersonales" },
      { label: "Conducta sexual", key: "conducta_sexual" },
      { label: "Sumario diagnóstico", key: "sumario_diagnostico" },
      { label: "Evaluación psicológica", key: "evaluacion_psicologica" },
      { label: "Tratamiento propuesto", key: "tratamiento" },
      { label: "Evolución", key: "evolucion" },
      { label: "Cargo del responsable", key: "cargo_responsable" },
      { label: "Universidad del responsable", key: "universidad_responsable" }
    ];

    let html = `<div class="tabla-citas-wrapper"><div style="padding:10px 0;">`;
    preguntas.forEach(p => {
      html += `
        <div style="margin-bottom:18px;">
          <div style="font-weight:bold;color:#134E5E;font-size:1.08em;">${p.label}</div>
          <div style="background:#f6f8f6;border-radius:6px;padding:8px 12px;margin-top:4px;color:#222;">
            ${datos[p.key] ? datos[p.key] : '<span style="color:#aaa;">Sin respuesta</span>'}
          </div>
        </div>
      `;
    });
    html += `</div></div>`;

    const contenedor = document.getElementById('historial-clinico-datos');
    if (contenedor) contenedor.innerHTML = html;
    document.getElementById('modal-historial-clinico').style.display = 'flex';
  }

  // Cerrar el modal
  document.getElementById('cerrar-modal-historial').onclick = function() {
    document.getElementById('modal-historial-clinico').style.display = 'none';
  };

  // Validación de formularios (historial e informe)
  document.getElementById('form-historial').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('mensaje-historial').textContent = '¡Historial guardado!';
    document.getElementById('mensaje-historial').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensaje-historial').style.display = 'none';
    }, 2000);
    this.reset();
  });

  // Mostrar inicio al cargar
  mostrarInicio();

  // Botón principal de pacientes
  document.getElementById('btn-pacientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });

  // Botón del menú lateral de pacientes
  document.getElementById('menu-pacientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });


  // Botón pendientes (menú)
  document.getElementById('menu-pendientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });

  // Botón inicio (menú)
  document.getElementById('menu-inicio').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
  });

  // Botón Horario (menú)
  document.getElementById('menu-horario').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('horario-seccion').style.display = 'block';
    mostrarHorarioLaboral();
  });

  // Botón pendientes principal
  document.getElementById('btn-pendientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });

  function cargarTablaPacientes() {
    const pacientes = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '12345678',
        filiacion: {
          primer_nombre: 'Juan',
          segundo_nombre: 'Carlos',
          primer_apellido: 'Pérez',
          segundo_apellido: 'Gómez',
          cedula: '12345678',
          fecha_nacimiento: '1990-01-01',
          lugar_nacimiento: 'Caracas',
          instruccion: 'Universitaria',
          ocupacion: 'Ingeniero',
          estado_civil: 'Soltero',
          religion: 'Católica',
          nombre_conyuge: '',
          telefono_conyuge: '',
          hijos: '2',
          edades_hijos: '5, 8',
          centro_estudio_trabajo: 'Empresa X',
          grado: '',
          lugar_residencia: 'Caracas',
          tiempo_residencia: '10 años',
          procedencia: 'Valencia',
          telefono: '04141234567',
          correo: 'juanperez@email.com'
        },
        familiares: {
          paterno_abuelo: 'Pedro Pérez',
          paterno_abuela: 'María Gómez',
          paterno_padre: 'Luis Pérez',
          paterno_tios: 'José, Andrés',
          materno_abuelo: 'Carlos Gómez',
          materno_abuela: 'Ana Torres',
          materno_madre: 'Lucía Gómez',
          materno_tios: 'Marta, Rosa',
          otros_hermanos: 'Luis',
          otros_esposo: '',
          otros_hijos: '2',
          otros_colaterales: 'Ninguno'
        }
      },
      {
        nombre: 'Ana',
        apellido: 'Gómez',
        cedula: '87654321',
        filiacion: {
          primer_nombre: 'Ana',
          segundo_nombre: '',
          primer_apellido: 'Gómez',
          segundo_apellido: 'Torres',
          cedula: '87654321',
          fecha_nacimiento: '1995-05-10',
          lugar_nacimiento: 'Maracay',
          instruccion: 'TSU',
          ocupacion: 'Estudiante',
          estado_civil: 'Soltera',
          religion: 'Cristiana',
          nombre_conyuge: '',
          telefono_conyuge: '',
          hijos: '',
          edades_hijos: '',
          centro_estudio_trabajo: 'Universidad Y',
          grado: '3er año',
          lugar_residencia: 'Maracay',
          tiempo_residencia: '3 años',
          procedencia: 'Barquisimeto',
          telefono: '04145556666',
          correo: 'anagomez@email.com'
        },
        familiares: {
          paterno_abuelo: '',
          paterno_abuela: '',
          paterno_padre: '',
          paterno_tios: '',
          materno_abuelo: '',
          materno_abuela: '',
          materno_madre: '',
          materno_tios: '',
          otros_hermanos: '',
          otros_esposo: '',
          otros_hijos: '',
          otros_colaterales: ''
        }
      }
    ];
    const tabla = document.getElementById('tabla-pacientes');
    tabla.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Cédula</th>
        <th>Acciones</th>
      </tr>
    `;
    pacientes.forEach((p, idx) => {
      tabla.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.apellido}</td>
          <td>${p.cedula}</td>
          <td>
            <button class="btn-modal btn-historial" data-idx="${idx}">
              <i class="fa-solid fa-notes-medical"></i> Historial clínico
            </button>
          </td>
        </tr>
      `;
    });
    // Guarda los pacientes en window para acceso global
    window._pacientesClinicos = pacientes;

    // Listener hist
    tabla.removeEventListener('click', tabla._historialListener); // Limpia si ya existe
    tabla._historialListener = function(e) {
      const btn = e.target.closest('.btn-historial');
      if (btn) {
        const idx = btn.getAttribute('data-idx');
        if (idx !== null) window.verHistorialPaciente(Number(idx));
      }
    };
    tabla.addEventListener('click', tabla._historialListener);
  }

  window.verHistorialPaciente = function(idx) {
    ocultarSecciones();
    document.getElementById('historial-paciente-seccion').style.display = 'block';
    mostrarPaginaHistorial(1);
  };

  // Navegación entre páginas del historial clínico
  function mostrarPaginaHistorial(n) {
    for (let i = 1; i <= 5; i++) {
      const page = document.getElementById('historial-page-' + i);
      if (page) page.style.display = (i === n) ? 'block' : 'none';
    }
  }
  // Página 1
  const btn = document.getElementById('btn-siguiente-historial-1');
  if (btn) btn.addEventListener('click', () => mostrarPaginaHistorial(2));

  // Página 2
  const btnAtr2 = document.getElementById('btn-atras-historial-2');
  const btnSig2 = document.getElementById('btn-siguiente-historial-2');
  if (btnAtr2) btnAtr2.onclick = () => mostrarPaginaHistorial(1);
  if (btnSig2) btnSig2.onclick = () => mostrarPaginaHistorial(3);

  // Página 3
  const btnAtr3 = document.getElementById('btn-atras-historial-3');
  const btnSig3 = document.getElementById('btn-siguiente-historial-3');
  if (btnAtr3) btnAtr3.onclick = () => mostrarPaginaHistorial(2);
  if (btnSig3) btnSig3.onclick = () => mostrarPaginaHistorial(4);

  // Página 4
  const btnAtr4 = document.getElementById('btn-atras-historial-4');
  const btnSig4 = document.getElementById('btn-siguiente-historial-4');
  if (btnAtr4) btnAtr4.onclick = () => mostrarPaginaHistorial(3);
  if (btnSig4) btnSig4.onclick = () => mostrarPaginaHistorial(5);

  // Página 5
  const btnAtr5 = document.getElementById('btn-atras-historial-5');
  if (btnAtr5) btnAtr5.onclick = () => mostrarPaginaHistorial(4);

  // Permitir agregar una fila extra en la tabla de sumario diagnóstico (máximo 7 filas, la última es la de aproximación diagnóstica)
  document.addEventListener('DOMContentLoaded', function() {
    const tbodyDiag = document.getElementById('tbody-sumario-diagnostico');
    const btnAgregarDiag = document.getElementById('agregar-fila-diagnostico');
    if (tbodyDiag && btnAgregarDiag) {
      btnAgregarDiag.addEventListener('click', function() {
        const filas = tbodyDiag.querySelectorAll('tr');
        // La última fila es la de aproximación diagnóstica
        if (filas.length < 7) {
          const nuevaFila = document.createElement('tr');
          nuevaFila.innerHTML = `
            <td><input type="text" style="width:100%;"></td>
            <td><input type="text" style="width:100%;"></td>
            <td><input type="text" style="width:100%;"></td>
            <td>
              <select style="width:100%;">
                <option value=""></option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Grave">Grave</option>
              </select>
            </td>
          `;
          // Inserta antes de la fila de aproximación diagnóstica
          tbodyDiag.insertBefore(nuevaFila, filas[filas.length - 1]);
        }
      });
    }
  });

  // Permitir agregar una fila extra en la tabla de baterías (máximo 5 filas)
  document.addEventListener('DOMContentLoaded', function() {
    const tbodyBat = document.getElementById('tbody-baterias');
    const btnAgregarBat = document.getElementById('agregar-fila-bateria');
    if (tbodyBat && btnAgregarBat) {
      btnAgregarBat.addEventListener('click', function() {
        const filas = tbodyBat.querySelectorAll('tr');
        if (filas.length < 5) {
          const nuevaFila = document.createElement('tr');
          nuevaFila.innerHTML = `
            <td><input type="text" style="width:100%;"></td>
            <td><input type="text" style="width:100%;"></td>
          `;
          tbodyBat.appendChild(nuevaFila);
        }
      });
    }
  });

  // --- HORARIO LABORAL MEJORADO ---

  // Días de la semana
  const DIAS_SEMANA = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  // Simulación de horarios actuales (estructura nueva)
  let horarioLaboral = {
    presencial: [
      // Ejemplo: { dia: 1, desde: "09:00 AM", hasta: "12:00 PM" }, ...
      { dia: 1, desde: "09:00 AM", hasta: "12:00 PM" },
      { dia: 1, desde: "01:00 PM", hasta: "04:00 PM" },
      { dia: 2, desde: "09:00 AM", hasta: "12:00 PM" },
      { dia: 2, desde: "01:00 PM", hasta: "04:00 PM" },
      { dia: 3, desde: "09:00 AM", hasta: "12:00 PM" },
      { dia: 3, desde: "01:00 PM", hasta: "04:00 PM" },
      { dia: 4, desde: "09:00 AM", hasta: "12:00 PM" },
      { dia: 4, desde: "01:00 PM", hasta: "04:00 PM" },
      { dia: 5, desde: "09:00 AM", hasta: "12:00 PM" },
      { dia: 5, desde: "01:00 PM", hasta: "04:00 PM" },
      { dia: 6, desde: "09:00 AM", hasta: "01:00 PM" }
      // Puedes agregar domingo si quieres
    ],
    online: [
      { dia: 1, desde: "06:00 PM", hasta: "08:00 PM" },
      { dia: 2, desde: "06:00 PM", hasta: "08:00 PM" },
      { dia: 3, desde: "06:00 PM", hasta: "08:00 PM" },
      { dia: 4, desde: "06:00 PM", hasta: "08:00 PM" },
      { dia: 5, desde: "06:00 PM", hasta: "08:00 PM" },
      { dia: 6, desde: "04:00 PM", hasta: "07:00 PM" }
      // Puedes agregar domingo si quieres
    ]
  };

  // Mostrar la sección de horario laboral
  function mostrarHorarioLaboral() {
    ocultarSecciones();
    document.getElementById('horario-seccion').style.display = 'block';
    // Siempre renderiza el formulario y el horario actual
    renderizarFormularioHorario(document.getElementById('tipo-horario').value);
    renderizarHorarioActual();
  }

  // Renderiza el formulario de horario laboral permitiendo varias franjas por día
  function renderizarFormularioHorario(tipo) {
    const horario = horarioLaboral[tipo] || [];
    // Agrupa franjas por día
    const franjasPorDia = {};
    horario.forEach(f => {
      if (!franjasPorDia[f.dia]) franjasPorDia[f.dia] = [];
      franjasPorDia[f.dia].push({ desde: f.desde, hasta: f.hasta });
    });

    let html = `<div style="margin-bottom:12px;"><b>Días:</b><br>`;
    for (let i = 1; i <= 6; i++) { // Lunes a Sábado
      html += `<label style="margin-right:10px;">
        <input type="checkbox" class="dia-checkbox" value="${i}" ${franjasPorDia[i] ? 'checked' : ''}> ${DIAS_SEMANA[i]}
      </label>`;
    }
    html += `</div>`;

    html += `<div id="horas-por-dia">`;
    for (let i = 1; i <= 6; i++) {
      if (!franjasPorDia[i]) continue;
      html += `<div style="margin-bottom:10px;border:1px solid #eee;padding:8px 12px;border-radius:6px;max-width:350px;">
        <b>${DIAS_SEMANA[i]}:</b>
        <div class="franjas-dia" data-dia="${i}">`;
      franjasPorDia[i].forEach((franja, idx) => {
        html += `
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
            <span style="width:50px;">Desde:</span>
            ${renderizarSelectHora('desde', franja.desde, i, idx)}
            <span style="width:40px;">Hasta:</span>
            ${renderizarSelectHora('hasta', franja.hasta, i, idx)}
            <button type="button" class="btn-eliminar-franja" data-dia="${i}" data-idx="${idx}" style="color:#c00;font-size:1.1em;">&times;</button>
          </div>
        `;
      });
      html += `
          <button type="button" class="btn-agregar-franja" data-dia="${i}" style="margin-top:6px;">+ Agregar franja</button>
        </div>
      </div>`;
    }
    html += `</div>`;
    document.getElementById('horario-formulario').innerHTML = html;

    // Listeners para checkboxes de días
    document.querySelectorAll('.dia-checkbox').forEach(cb => {
      cb.addEventListener('change', function() {
        const dia = parseInt(this.value);
        if (this.checked) {
          // Si se selecciona, agrega una franja vacía
          if (!horarioLaboral[tipo].some(f => f.dia === dia)) {
            horarioLaboral[tipo].push({ dia, desde: "", hasta: "" });
          }
        } else {
          // Si se deselecciona, elimina todas las franjas de ese día
          horarioLaboral[tipo] = horarioLaboral[tipo].filter(f => f.dia !== dia);
        }
        renderizarFormularioHorario(tipo);
      });
    });

    // Listener para agregar franja
    document.querySelectorAll('.btn-agregar-franja').forEach(btn => {
      btn.addEventListener('click', function() {
        const dia = parseInt(this.getAttribute('data-dia'));
        horarioLaboral[tipo].push({ dia, desde: "", hasta: "" });
        renderizarFormularioHorario(tipo);
      });
    });

    // Listener para eliminar franja
    document.querySelectorAll('.btn-eliminar-franja').forEach(btn => {
      btn.addEventListener('click', function() {
        const dia = parseInt(this.getAttribute('data-dia'));
        const idx = parseInt(this.getAttribute('data-idx'));
        let franjas = horarioLaboral[tipo].filter(f => f.dia === dia);
        franjas.splice(idx, 1);
        // Elimina todas las franjas de ese día y vuelve a agregar las restantes
        horarioLaboral[tipo] = horarioLaboral[tipo].filter(f => f.dia !== dia).concat(
          franjas.map(f => ({ dia, desde: f.desde, hasta: f.hasta }))
        );
        renderizarFormularioHorario(tipo);
      });
    });

    // Listener para selects de hora
    document.querySelectorAll('.select-hora-desde, .select-hora-hasta').forEach(sel => {
      sel.addEventListener('change', function() {
        const dia = parseInt(this.getAttribute('data-dia'));
        const idx = parseInt(this.getAttribute('data-idx'));
        const tipoHora = this.classList.contains('select-hora-desde') ? 'desde' : 'hasta';
        let franjas = horarioLaboral[tipo].filter(f => f.dia === dia);
        if (franjas[idx]) franjas[idx][tipoHora] = this.value;
        // Actualiza el array global
        horarioLaboral[tipo] = horarioLaboral[tipo].filter(f => f.dia !== dia).concat(
          franjas.map(f => ({ dia, desde: f.desde, hasta: f.hasta }))
        );
      });
    });
  }

  // Renderiza un select de hora en formato 12h
  function renderizarSelectHora(tipo, valor, diaIdx, franjaIdx) {
    let opciones = '<option value="">--</option>';
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        let hora24 = h;
        let sufijo = hora24 >= 12 ? 'PM' : 'AM';
        let hora12 = hora24 % 12;
        if (hora12 === 0) hora12 = 12;
        let horaStr = `${hora12.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'} ${sufijo}`;
        opciones += `<option value="${horaStr}" ${valor === horaStr ? 'selected' : ''}>${horaStr}</option>`;
      }
    }
    return `<select class="select-hora-${tipo}" data-dia="${diaIdx}" data-idx="${franjaIdx}" required style="min-width:110px;">
    ${opciones}
  </select>`;
  }

  // Guardar horario laboral (con validaciones)
  document.getElementById('form-horario-laboral').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo-horario').value;
    let error = false;
    // Validar todas las franjas
    for (const f of horarioLaboral[tipo]) {
      if (!f.desde || !f.hasta) {
        error = true;
        break;
      }
      const desdeMin = horaStrAMPMaMinutos(f.desde);
      const hastaMin = horaStrAMPMaMinutos(f.hasta);
      if (desdeMin >= hastaMin) {
        error = true;
        break;
      }
    }
    if (error) {
      alert('Por favor, seleccione horas válidas para cada franja (la hora de inicio debe ser menor que la de fin).');
      return;
    }
    document.getElementById('modal-exito-horario').style.display = 'flex';
    renderizarHorarioActual();
  });

  // Convierte "09:00 AM" a minutos desde las 00:00
  function horaStrAMPMaMinutos(str) {
    if (!str) return 0;
    const match = str.match(/^(\d+):(\d+) (AM|PM)$/);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3];
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }

  // Cancelar horario
  document.getElementById('cancelar-horario').addEventListener('click', function() {
    mostrarHorarioLaboral();
  });

  // Cambiar tipo de horario
  document.getElementById('tipo-horario').addEventListener('change', function() {
    renderizarFormularioHorario(this.value);
  });

  // Modal éxito
  document.getElementById('btn-aceptar-exito-horario').addEventListener('click', function() {
    document.getElementById('modal-exito-horario').style.display = 'none';
    mostrarHorarioLaboral();
  });

  // Mostrar horario actual como calendario compacto
  function renderizarHorarioActual() {
    let html = `<h3 style="margin-top:24px;">Horario actual</h3>`;
    ['presencial', 'online'].forEach(tipo => {
      html += `<div style="margin-bottom:6px;"><b>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:</b></div>`;
      if (!horarioLaboral[tipo] || horarioLaboral[tipo].length === 0) {
        html += `<div style="margin-bottom:10px;color:#888;">Sin horario definido</div>`;
        return;
      }
      html += `<table class="tabla-citas" style="margin-bottom:14px;max-width:420px;"><tr><th>Día</th><th>Horario</th></tr>`;
      horarioLaboral[tipo].forEach(h => {
        html += `<tr>
          <td>${DIAS_SEMANA[h.dia]}</td>
          <td>${h.desde} - ${h.hasta}</td>
        </tr>`;
      });
      html += `</table>`;
    });
    document.getElementById('horario-actual').innerHTML = html;
  }


  // Botón principal de horario laboral
  const btnHorario = document.getElementById('btn-horario');
  if (btnHorario) {
    btnHorario.addEventListener('click', function() {
      mostrarHorarioLaboral();
    });
  }

  // Botón del menú lateral de horario laboral
  const menuHorario = document.getElementById('menu-horario');
  if (menuHorario) {
    menuHorario.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarHorarioLaboral();
    });
  }

  // Mostrar modal de éxito al guardar historial clínico multipágina
  document.getElementById('form-historial-clinico').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('modal-exito-historial').style.display = 'flex';
  });

  // Cerrar modal de éxito y volver al panel principal
  document.getElementById('btn-aceptar-exito-historial').addEventListener('click', function() {
    document.getElementById('modal-exito-historial').style.display = 'none';
    ocultarSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
  });

  // --- EDITAR FORMULARIOS (NUEVO) ---

  // Estructura de páginas: cada página es un array de preguntas
let preguntasHistorialPaginas = [
  [ // Página 1
    "Primer nombre",
    "Segundo nombre",
    "Primer apellido",
    "Segundo apellido",
    "Cédula",
    "Fecha de nacimiento",
    "Lugar de nacimiento",
    "Instrucción",
    "Ocupación",
    "Estado civil",
    "Religión",
    "Nombre del cónyuge",
    "Teléfono del cónyuge",
    "Hijos",
    "Edades de los hijos",
    "Centro de estudio y/o trabajo",
    "Grado",
    "Lugar de residencia",
    "Tiempo de residencia",
    "Procedencia",
    "Teléfono",
    "Correo"
  ],
  [ // Página 2
    "Experiencias durante los estudios primarios (recurso y apoyo, problemas de conducta, indisciplina)",
    "Dificultades académicas (cómo enfrentaba los exámenes) - primaria",
    "Experiencias durante la secundaria (recurso y apoyo, problemas conducta indisciplina)",
    "Dificultades académicas (cómo enfrentaba los exámenes) - secundaria",
    "Experiencias durante los estudios superiores (recurso y apoyo, problemas de conducta, indisciplina)",
    "Dificultades académicas - superior",
    "Problemas afectivos o conducta durante su niñez",
    "Problemas afectivos en la Pubertad (cambios fisiológicos, maduración, características sexuales, otras particularidades)",
    "Particularidades de la adolescencia",
    "Problemas afectivos o de conducta en la Adolescencia",
    "Grado de armonía entre la Madurez Biológica y Psicológica",
    "Desarrollo de la Voluntad (rapidez, decisión y ejecución)",
    "Grado de autonomía en la deliberación y la acción",
    "Persistencia en el esfuerzo",
    "Jerarquía de valores (concepción de la vida y el mundo): Estilo de vida",
    "Sexualidad activa e inactiva",
    "Problemas legales: Norma a nivel familiar",
    "Servicio Militar Obligatorio: Preferencias en el SMO",
    "Hábitos e intereses (consumo de alcohol, drogas, etc.)",
    "Enfermedad y accidentes (desde la niñez hasta la actualidad)",
    "Elección de profesión u Oficio (libre, influenciado o forzado)"
  ],
  [ // Página 3
    "Ambiente social Actual Trabajo (actual y anteriores)",
    "Vivienda",
    "Economía",
    "Relaciones con sus jefes, superiores, compañeros, subalternos",
    "Crecimiento psicosocial",
    "Ambiciones laborales",
    "Cambios de profesión, oficios o trabajo (frecuentes, circunstanciales y sus causas)",
    "Cuadro Familiar",
    "Relaciones Interpersonales",
    "Religión (personal/social)",
    "Recreación",
    "Conducta sexual (inicio y vida sexual, desde los juegos infantiles a la actualidad) Relación con las personas del mismo sexo y del sexo opuesto",
    "Elección de la pareja",
    "¿Le cuesta trabajo elegir pareja?",
    "¿Fiel y exigente?",
    "Noviazgo (número y duración de ellos)",
    "Matrimonio (edad del paciente y la pareja)",
    "¿Qué opina del matrimonio?",
    "Particularidades del día de la boda",
    "Vida Matrimonial (armonía o desarmonía conyugal)",
    "Separación",
    "Divorcio (causas)",
    "Problemas y periodos críticos particularidades del climaterio, menopausia y edad crítica"
  ],
  [ // Página 4
    "Abuelo paterno",
    "Abuela paterna",
    "Padre",
    "Tíos paternos",
    "Abuelo materno",
    "Abuela materna",
    "Madre",
    "Tíos maternos",
    "Hermanos(as)",
    "Esposo(a)",
    "Hijos(as)",
    "Colaterales"
  ],
  [ // Página 5
    "Sumario diagnóstico",
    "Conclusión",
    "Examen conductual y de las facultades psíquicas",
    "Síntesis de lo encontrado",
    "Baterías aplicadas",
    "Síntesis de los hallazgos en las baterías",
    "Programa de tratamiento propuesto",
    "Evolución",
    "Firma responsable - Nombre",
    "Firma responsable - Cargo",
    "Firma responsable - Universidad",
    "Firma responsable - Teléfono",
    "Firma responsable - Correo"
  ]
];

// Informe médico (puedes agregar más preguntas si lo deseas)
let preguntasInforme = [
  "Redacte el informe médico"
];

  // Renderiza los campos de cada página del historial clínico
  function renderizarPaginasHistorial() {
    preguntasHistorialPaginas.forEach((pregs, pageIdx) => {
      const cont = document.getElementById('contenedor-historial-' + (pageIdx + 1));
      if (!cont) return;
      let html = '';
      pregs.forEach((preg, idx) => {
        // Decide si es input o textarea según la página o el texto
        if (pageIdx === 0 || pageIdx === 3 || preg.toLowerCase().includes('nombre') || preg.toLowerCase().includes('teléfono') || preg.toLowerCase().includes('correo')) {
          html += `<label style="display:block;margin-bottom:10px;">${preg}:<input type="text" name="historial_${pageIdx}_${idx}" style="width:100%;"></label>`;
        } else {
          html += `<label style="display:block;margin-bottom:10px;">${preg}:<textarea name="historial_${pageIdx}_${idx}" style="width:100%;"></textarea></label>`;
        }
      });
      cont.innerHTML = html;
    });
  }

  // Renderiza los campos del informe médico
  function renderizarInformeMedico() {
    const cont = document.getElementById('contenedor-informe-medico');
    if (!cont) return;
    let html = '';
    preguntasInforme.forEach((preg, idx) => {
      html += `<label style="display:block;margin-bottom:10px;">${preg}:<textarea name="informe_${idx}" style="width:100%;min-height:180px;"></textarea></label>`;
    });
    document.getElementById('contenedor-informe-medico-dinamico').innerHTML = html;
  }

  // Cuando guardes cambios en el editor de preguntas, vuelve a renderizar los formularios
  document.getElementById('btn-guardar-formulario').onclick = function() {
    // Aquí deberías actualizar preguntasHistorialPaginas y preguntasInforme según los cambios del editor
    // (deberás adaptar tu editor para que modifique estas variables)
    renderizarPaginasHistorial();
    renderizarInformeMedico();
    document.getElementById('modal-exito-editar-formulario').style.display = 'flex';
  };

  // Al iniciar
  renderizarPaginasHistorial();
  renderizarInformeMedico();

  // --- CONTROL DE VISIBILIDAD DE SECCIÓN EDITAR FORMULARIOS ---
function ocultarEditarFormularios() {
  const seccion = document.getElementById('editar-formularios-seccion');
  if (seccion) seccion.style.display = 'none';
  const modal = document.getElementById('modal-editar-pregunta');
  if (modal) modal.remove();
}

// Sobrescribe ocultarSecciones para ocultar también editar formularios
const _ocultarSeccionesOriginal = ocultarSecciones;
ocultarSecciones = function() {
  _ocultarSeccionesOriginal();
  ocultarEditarFormularios();
};

  // --- SINCRONIZACIÓN DE PREGUNTAS CON FORMULARIOS REALES ---

  // Actualiza los campos del historial clínico multipágina según preguntasHistorial
  function actualizarCamposHistorialClinico() {
    // Página 1: Datos de filiación
    // (No se actualiza dinámicamente porque los campos están fijos en el HTML)
    // Página 2, 3, 4, 5: Solo si quieres que las preguntas sean dinámicas, deberías renderizar los labels y campos según preguntasHistorial
    // Aquí solo se actualizan los labels de las preguntas si cambian
    // Si quieres que los campos sean 100% dinámicos, deberías renderizar todo el formulario con JS
    // Por ahora, solo actualiza los labels si coinciden por orden
    const labels = document.querySelectorAll('#historial-paciente-seccion .historial-page label');
    preguntasHistorialTmp.forEach((preg, idx) => {
      if (labels[idx]) {
        // Si el label tiene un ":", solo cambia el texto antes de los dos puntos
        let label = labels[idx];
        let colonIdx = label.innerHTML.indexOf(':');
        if (colonIdx !== -1) {
          label.innerHTML = preg + label.innerHTML.substring(colonIdx);
        } else {
          // Para textarea, cambia solo el texto antes del textarea
          let taIdx = label.innerHTML.indexOf('<textarea');
          if (taIdx !== -1) {
            label.innerHTML = preg + label.innerHTML.substring(taIdx - 1);
          } else {
            // Para input
            let inIdx = label.innerHTML.indexOf('<input');
            if (inIdx !== -1) {
              label.innerHTML = preg + label.innerHTML.substring(inIdx - 1);
            }
          }
        }
      }
    });
  };

  

  // Actualiza el formulario de informe médico (si es dinámico)
  function actualizarCamposInformeMedico() {
    // Si tienes un área de informe médico editable, puedes actualizar el placeholder
    const textarea = document.querySelector('#modal-informe-medico textarea[name="informe_texto"]');
    if (textarea && preguntasInformeTmp.length > 0) {
      textarea.placeholder = preguntasInformeTmp[0];
    }
  }

  // --- BOTÓN PRINCIPAL DE EDITAR FORMULARIOS ---
  const btnEditarFormularios = document.getElementById('btn-editar-formularios');
  if (btnEditarFormularios) {
    btnEditarFormularios.onclick = function() {
      ocultarSecciones();
      document.getElementById('editar-formularios-seccion').style.display = 'block';
      document.getElementById('tipo-formulario-editar').value = 'historial';
      preguntasHistorialPaginasTmp = preguntasHistorialPaginas.map(arr => [...arr]);
      preguntasInformeTmp = [...preguntasInforme];
      paginaActualEditar = 0;
      renderizarPreguntasEditar('historial');
    };
  }

  // --- NUEVO: Estado temporal para edición multipágina ---
let preguntasHistorialPaginasTmp = preguntasHistorialPaginas.map(arr => [...arr]);
let paginaActualEditar = 0; // 0 = página 1

// --- NUEVO: Renderizar editor de preguntas multipágina ---
function renderizarPreguntasEditar(tipo) {
  const cont = document.getElementById('contenedor-preguntas-editar');
  let html = '';

  if (tipo === 'historial') {
    // Selector de página
    html += `<div style="margin-bottom:12px;">
      <label>Página: 
        <select id="selector-pagina-editar">` +
      preguntasHistorialPaginasTmp.map((_, i) =>
        `<option value="${i}" ${i === paginaActualEditar ? 'selected' : ''}>${i + 1}</option>`
      ).join('') +
      `</select>
      </label>
    </div>`;

    // Preguntas de la página seleccionada
    let preguntas = preguntasHistorialPaginasTmp[paginaActualEditar];
    preguntas.forEach((preg, idx) => {
      html += `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="flex:1;">${preg}</span>
          <button class="btn-editar-pregunta" data-idx="${idx}" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-eliminar-pregunta" data-idx="${idx}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    });
  } else {
    // Informe médico (plano)
    preguntasInformeTmp.forEach((preg, idx) => {
      html += `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="flex:1;">${preg}</span>
          <button class="btn-editar-pregunta" data-idx="${idx}" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-eliminar-pregunta" data-idx="${idx}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    });
  }

  cont.innerHTML = html;

  // Selector de página
  if (tipo === 'historial') {
    const selector = document.getElementById('selector-pagina-editar');
    if (selector) {
      selector.onchange = function () {
        paginaActualEditar = parseInt(this.value, 10);
        renderizarPreguntasEditar('historial');
      };
    }
  }

  // Listeners editar
  cont.querySelectorAll('.btn-editar-pregunta').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      mostrarModalPregunta({
        modo: 'editar',
        valorActual: tipo === 'historial'
          ? preguntasHistorialPaginasTmp[paginaActualEditar][idx]
          : preguntasInformeTmp[idx],
        onAceptar: nueva => {
          if (tipo === 'historial') {
            preguntasHistorialPaginasTmp[paginaActualEditar][idx] = nueva;
            renderizarPreguntasEditar(tipo);
          } else {
            preguntasInformeTmp[idx] = nueva;
            renderizarPreguntasEditar(tipo);
          }
        }
      });
    };
  });

  // Listeners eliminar
  cont.querySelectorAll('.btn-eliminar-pregunta').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      if (confirm('¿Eliminar esta pregunta?')) {
        if (tipo === 'historial') {
          preguntasHistorialPaginasTmp[paginaActualEditar].splice(idx, 1);
          renderizarPreguntasEditar(tipo);
        } else {
          preguntasInformeTmp.splice(idx, 1);
          renderizarPreguntasEditar(tipo);
        }
      }
    };
  });
}

// --- NUEVO: Agregar pregunta ---
document.getElementById('btn-agregar-pregunta').onclick = function() {
  const tipo = document.getElementById('tipo-formulario-editar').value;
  mostrarModalPregunta({
    modo: 'agregar',
    valorActual: '',
    onAceptar: nueva => {
      if (tipo === 'historial') {
        preguntasHistorialPaginasTmp[paginaActualEditar].push(nueva);
        renderizarPreguntasEditar(tipo);
      } else {
        preguntasInformeTmp.push(nueva);
        renderizarPreguntasEditar(tipo);
      }
    }
  });
};

// --- NUEVO: Guardar cambios ---
document.getElementById('btn-guardar-formulario').onclick = function() {
  preguntasHistorialPaginas = preguntasHistorialPaginasTmp.map(arr => [...arr]);
  preguntasInforme = [...preguntasInformeTmp];
  renderizarPaginasHistorial();
  renderizarInformeMedico();
  document.getElementById('modal-exito-editar-formulario').style.display = 'flex';
};

// --- NUEVO: Cambiar tipo de formulario en el editor ---
document.getElementById('tipo-formulario-editar').addEventListener('change', function() {
  if (this.value === 'historial') {
    paginaActualEditar = 0;
  }
  renderizarPreguntasEditar(this.value);
});

// MODAL BONITO PARA AGREGAR/EDITAR PREGUNTA
function mostrarModalPregunta({modo, valorActual = '', onAceptar}) {
  // Elimina si ya existe
  let modal = document.getElementById('modal-editar-pregunta');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'modal-editar-pregunta';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px 22px;border-radius:10px;box-shadow:0 2px 16px #0002;max-width:350px;width:95vw;text-align:center;">
      <div style="font-size:1.1em;font-weight:bold;margin-bottom:12px;">
        ${modo === 'agregar' ? 'Agregar nueva pregunta' : 'Editar pregunta'}
      </div>
      <input type="text" id="input-modal-pregunta" value="${valorActual.replace(/"/g,'&quot;')}" style="width:100%;padding:8px 10px;font-size:1em;border-radius:6px;border:1px solid #bbb;margin-bottom:18px;" maxlength="200" autofocus>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="btn-aceptar-modal-pregunta" class="btn-modal" style="padding:7px 22px;">Aceptar</button>
        <button id="btn-cancelar-modal-pregunta" class="btn-modal btn-cancelar" style="padding:7px 22px;">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('input-modal-pregunta').focus();

  document.getElementById('btn-aceptar-modal-pregunta').onclick = function() {
    const val = document.getElementById('input-modal-pregunta').value.trim();
    if (val) {
      onAceptar(val);
      modal.remove();
    } else {
      document.getElementById('input-modal-pregunta').focus();
    }
  };
  document.getElementById('btn-cancelar-modal-pregunta').onclick = function() {
    modal.remove();
  };
}

// --- BOTÓN ACEPTAR DEL MODAL DE ÉXITO AL GUARDAR FORMULARIO ---
document.getElementById('btn-aceptar-exito-editar-formulario').onclick = function() {
  document.getElementById('modal-exito-editar-formulario').style.display = 'none';
  ocultarSecciones();
  document.getElementById('principal-botones').style.display = 'flex';
};

// --- NUEVO: Muestra la sección de informe médico para la cita seleccionada ---
function mostrarInformeMedicoPaciente(idxCita) {
  ocultarSecciones();
  document.getElementById('informe-medico-seccion').style.display = 'block';

  // Asegúrate de que los pacientes estén cargados
  if (!window._pacientesClinicos || window._pacientesClinicos.length === 0) {
    cargarTablaPacientes();
  }

  const cita = citasPendientes[idxCita];
  const pacientes = window._pacientesClinicos || [];
  let paciente = null;

  // Busca por cédula en historial clínico
  if (cita.cedula) {
    paciente = pacientes.find(p => p.filiacion && p.filiacion.cedula === cita.cedula);
  } else {
    // Si no hay cédula en la cita, intenta buscar por nombre y apellido
    const nombreCita = (cita.paciente || '').toLowerCase().replace(/\s+/g, ' ').trim();
    paciente = pacientes.find(p => {
      const f = p.filiacion || {};
      const nombreCompleto = [
        f.primer_nombre, f.segundo_nombre, f.primer_apellido, f.segundo_apellido
      ].filter(Boolean).join(' ').toLowerCase().replace(/\s+/g, ' ').trim();
      const nombreSimple = [f.primer_nombre, f.primer_apellido].filter(Boolean).join(' ').toLowerCase().replace(/\s+/g, ' ').trim();
      return nombreCita === nombreCompleto || nombreCita === nombreSimple;
    });
  }

  if (!paciente) {
    document.getElementById('datos-paciente-informe').innerHTML = '<b>Paciente no encontrado</b>';
    document.getElementById('contenedor-informe-medico-dinamico').innerHTML = '';
    return;
  }

  const filiacion = paciente.filiacion || {};
  document.getElementById('datos-paciente-informe').innerHTML = `
    <div style="margin-bottom:10px;"><b>Primer nombre:</b> ${filiacion.primer_nombre || ''}</div>
    <div style="margin-bottom:10px;"><b>Segundo nombre:</b> ${filiacion.segundo_nombre || ''}</div>
    <div style="margin-bottom:10px;"><b>Primer apellido:</b> ${filiacion.primer_apellido || ''}</div>
    <div style="margin-bottom:10px;"><b>Segundo apellido:</b> ${filiacion.segundo_apellido || ''}</div>
    <div style="margin-bottom:10px;"><b>Cédula:</b> ${filiacion.cedula || ''}</div>
    <div style="margin-bottom:10px;"><b>Fecha de nacimiento:</b> ${filiacion.fecha_nacimiento || ''}</div>
  `;

  // Renderiza preguntas del informe médico (solo una vez, sin duplicar redacción)
  let html = '';
  preguntasInforme.forEach((preg, idx) => {
    html += `<label style="display:block;margin-bottom:10px;">${preg}:<textarea name="informe_${idx}" style="width:100%;min-height:180px;"></textarea></label>`;
  });
  document.getElementById('contenedor-informe-medico-dinamico').innerHTML = html;

  document.getElementById('form-informe-medico-dinamico').reset();
}

// Listener para cancelar informe médico
document.getElementById('btn-cancelar-informe-medico').onclick = function() {
  ocultarSecciones();
  document.getElementById('pendientes-seccion').style.display = 'block';
  mostrarPendientes();
};

// Listener para guardar informe médico
document.getElementById('form-informe-medico-dinamico').addEventListener('submit', function(e) {
  e.preventDefault();
  // Encuentra el índice de la cita actual (busca por cédula o nombre)
  let idxCita = null;
  const datosCedula = document.querySelector('#datos-paciente-informe div:nth-child(5)');
  let cedula = '';
  if (datosCedula) {
    cedula = datosCedula.textContent.replace('Cédula:', '').trim();
  }
  if (cedula) {
    idxCita = citasPendientes.findIndex(c => c.cedula === cedula);
  }
  // Si no encuentra por cédula, busca por nombre
  if (idxCita === -1 || idxCita === null) {
    const datosNombre = document.querySelector('#datos-paciente-informe div:nth-child(1)');
    const nombre = datosNombre ? datosNombre.textContent.replace('Primer nombre:', '').trim() : '';
    idxCita = citasPendientes.findIndex(c => (c.paciente || '').split(' ')[0] === nombre);
  }
  // Guarda el índice en window para usarlo al aceptar el modal
  window._ultimoIdxInformeMedico = idxCita;

  document.getElementById('modal-exito-informe').style.display = 'flex';
});

// Botón aceptar del modal de éxito informe médico
document.getElementById('btn-aceptar-exito-informe').onclick = function() {
  // Elimina la cita pendiente correspondiente
  const idx = window._ultimoIdxInformeMedico;
  if (typeof idx === 'number' && idx >= 0) {
    citasPendientes.splice(idx, 1);
  }
  document.getElementById('modal-exito-informe').style.display = 'none';
  ocultarSecciones();
  document.getElementById('pendientes-seccion').style.display = 'block';
  mostrarPendientes(); //
};
});
=======
document.addEventListener('DOMContentLoaded', function() {
  // Menú desplegable (igual que antes)
  const menuToggle = document.getElementById('menu-toggle');
  const menuList = document.getElementById('menu-list');
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function(e) {
    if (!menuToggle.contains(e.target) && !menuList.contains(e.target)) {
      menuList.style.display = 'none';
    }
  });

  // Menú usuario (igual que antes)
  const userDropdown = document.getElementById('user-dropdown');
  const userIconBtn = document.getElementById('user-icon-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (userIconBtn && userDropdown && userDropdownMenu) {
    userIconBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!userDropdown.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });
  }

  // Ocultar todas las secciones
  function ocultarSecciones() {
    document.getElementById('principal-botones').style.display = 'none';
    document.getElementById('pendientes-seccion').style.display = 'none';
    document.getElementById('historial-seccion').style.display = 'none';
    document.getElementById('informe-seccion').style.display = 'none';
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('pacientes-seccion').style.display = 'none';
    document.getElementById('historial-paciente-seccion').style.display = 'none';
  }

  // Mostrar botones principales
  function mostrarInicio() {
    ocultarSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
  }

  // Botones principales
  document.getElementById('btn-pendientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });
  document.getElementById('btn-informe').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('informe-seccion').style.display = 'block';
  });

  // Menú lateral
  document.getElementById('menu-inicio').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarInicio();
  });
  document.getElementById('menu-pendientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });
  document.getElementById('menu-informe').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('informe-seccion').style.display = 'block';
  });
  document.getElementById('menu-pacientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });

  // Editar perfil
  document.getElementById('editar-perfil').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('principal-botones').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById('editar-perfil-seccion').style.display = 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
    document.getElementById('pregunta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').value = '';
  });

  // Desplegar usuario/correo
  document.getElementById('btn-desplegar-usuario').addEventListener('click', function() {
    const div = document.getElementById('desplegable-usuario');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  // Desplegar contraseña
  document.getElementById('btn-desplegar-contrasena').addEventListener('click', function() {
    const div = document.getElementById('desplegable-contrasena');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  // Desplegar pregunta de seguridad
  document.getElementById('btn-desplegar-seguridad').addEventListener('click', function() {
    const div = document.getElementById('desplegable-seguridad');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
  });

  // Cambiar tipo de cambio (usuario/correo)
  document.getElementById('tipo-cambio-usuario').addEventListener('change', function() {
    const inputUsuario = document.getElementById('nuevo-usuario');
    const inputCorreo = document.getElementById('nuevo-correo');
    if (this.value === 'usuario') {
      inputUsuario.style.display = 'block';
      inputCorreo.style.display = 'none';
    } else if (this.value === 'correo') {
      inputUsuario.style.display = 'none';
      inputCorreo.style.display = 'block';
    } else {
      inputUsuario.style.display = 'none';
      inputCorreo.style.display = 'none';
    }
  });

  // Cancelar edición de perfil
  document.getElementById('cancelar-editar-perfil').addEventListener('click', function() {
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('principal-botones').style.display = 'flex';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
    document.getElementById('pregunta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').value = '';
  });

  // Guardar cambios de perfil
  document.getElementById('guardar-cambios-perfil').addEventListener('click', function() {
    const usuario = document.getElementById('nuevo-usuario').value.trim();
    const correo = document.getElementById('nuevo-correo').value.trim();
    const pass1 = document.getElementById('nueva-contrasena').value;
    const pass2 = document.getElementById('confirmar-contrasena').value;
    const mensaje = document.getElementById('mensaje-contrasena');
    const pregunta = document.getElementById('pregunta-seguridad');
    const respuesta = document.getElementById('respuesta-seguridad');

    // Validación de contraseña
    if (
      document.getElementById('desplegable-contrasena').style.display === 'block' &&
      (pass1 || pass2)
    ) {
      if (!pass1) {
        mensaje.textContent = 'Ingrese la nueva contraseña.';
        mensaje.style.display = 'block';
        return;
      }
      if (!pass2) {
        mensaje.textContent = 'Por favor, confirme la nueva contraseña.';
        mensaje.style.display = 'block';
        return;
      }
      if (pass1 !== pass2) {
        mensaje.textContent = 'Las contraseñas no coinciden.';
        mensaje.style.display = 'block';
        return;
      }
    }

    // Validación de pregunta de seguridad
    if (document.getElementById('desplegable-seguridad').style.display === 'block') {
      if (!pregunta.value) {
        alert('Seleccione una pregunta de seguridad.');
        return;
      }
      if (!respuesta.value.trim()) {
        alert('Ingrese la respuesta de seguridad.');
        return;
      }
    }

    mensaje.style.display = 'none';
    alert('Cambios guardados correctamente.');
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('principal-botones').style.display = 'flex';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nuevo-correo').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    pregunta.value = '';
    respuesta.value = '';
  });

  // Ejemplo de datos de citas pendientes
  const citasPendientes = [
    {
      fecha: '2025-06-25',
      hora: '10:00 AM',
      paciente: 'Juan Pérez',
      categoria: 'Psicoterapia Individual',
      modalidad: 'presencial',
      pago: 'Pago móvil',
      estado: 'En Espera'
    },
    {
      fecha: '2025-06-28',
      hora: '07:00 PM',
      paciente: 'Ana Gómez',
      categoria: 'Psicoterapia Infantil',
      pago: 'Transferencias',
      modalidad: 'online',
      estado: 'En Espera'
    }
  ];

  // --- MODAL REPROGRAMAR ---
  let citaAReprogramar = null;

  function abrirModalReprogramar(idx) {
    citaAReprogramar = idx;
    modalidadReprogramar = citasPendientes[idx].modalidad || 'presencial'; // por defecto presencial
    document.getElementById('modal-reprogramar').style.display = 'flex'; // <-- centrado igual que historial clínico
    document.getElementById('nueva-fecha').value = '';
    document.getElementById('nueva-hora').innerHTML = '<option value="">Seleccione</option>';
    document.getElementById('nota-reprogramar').value = '';
  }

  function cerrarModalReprogramar() {
    document.getElementById('modal-reprogramar').style.display = 'none';
    citaAReprogramar = null;
  }

  // --- HORARIOS Y FECHAS DISPONIBLES SEGÚN MODALIDAD PARA REPROGRAMAR ---
  const horariosReservados = {
    '2025-06-13': ['09:00 AM', '06:00 PM'],
    '2025-06-14': ['10:00 AM'],
  };

  function generarTodasLasHoras() {
    const horas = [];
    for (let h = 9; h <= 20; h++) {
      horas.push({ h, m: 0 });
      if (h !== 20) horas.push({ h, m: 30 });
    }
    return horas;
  }

  function formatoHora(h, m) {
    let sufijo = h < 12 ? 'AM' : 'PM';
    let hora12 = h % 12;
    if (hora12 === 0) hora12 = 12;
    return (
      (hora12 < 10 ? '0' : '') + hora12 + ':' + (m === 0 ? '00' : '30') + ' ' + sufijo
    );
  }

  function esHoraPermitida(modalidad, diaSemana, h, m) {
    if (modalidad === 'presencial') {
      if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a viernes: 9:00-12:00 y 13:00-16:00
        if ((h >= 9 && h < 12) || (h >= 13 && h < 16)) return true;
      } else if (diaSemana === 6) {
        // Sábado: 9:00-13:00
        if (h >= 9 && h < 13) return true;
      }
    } else if (modalidad === 'online') {
      if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a viernes: 6:00pm-8:00pm
        if (h >= 18 && h <= 20) return true;
      } else if (diaSemana === 6) {
        // Sábado: 4:00pm-7:00pm
        if (h >= 16 && h <= 19) return true;
      }
    }
    return false;
  }

  function getDayOfWeek(dateString) {
    // 0: domingo, 1: lunes, ..., 6: sábado
    return new Date(dateString).getDay();
  }

  // Cambia el evento de fecha para usar la modalidad correcta y mostrar horas válidas
  document.getElementById('nueva-fecha').addEventListener('change', function() {
    const fechaVal = this.value;
    const selectHora = document.getElementById('nueva-hora');
    selectHora.innerHTML = '<option value="">Seleccione</option>';
    if (!fechaVal) return;
    const diaSemana = getDayOfWeek(fechaVal);
    const modalidad = modalidadReprogramar; // viene de la cita seleccionada
    const todasHoras = generarTodasLasHoras();
    const reservados = horariosReservados[fechaVal] || [];

    if (diaSemana === 0) {
      selectHora.innerHTML = '<option value="">Horario no laborable</option>';
      selectHora.disabled = true;
      return;
    }
    selectHora.disabled = false;

    todasHoras.forEach(({ h, m }) => {
      const horaStr = formatoHora(h, m);
      const option = document.createElement('option');
      option.value = horaStr;
      option.textContent = horaStr;

      if (!esHoraPermitida(modalidad, diaSemana, h, m)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (cerrado)';
      } else if (reservados.includes(horaStr)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (reservado)';
      }
      selectHora.appendChild(option);
    });
  });

  // Validar si selecciona un horario reservado o cerrado en el modal
  document.getElementById('nueva-hora').addEventListener('change', function() {
    const fechaVal = document.getElementById('nueva-fecha').value;
    const diaSemana = getDayOfWeek(fechaVal);
    const modalidad = modalidadReprogramar;
    const valor = this.value;
    const reservados = horariosReservados[fechaVal] || [];

    let partes = valor.match(/^(\d+):(\d+) (AM|PM)$/);
    let h = 0, m = 0;
    if (partes) {
      h = parseInt(partes[1], 10);
      m = parseInt(partes[2], 10);
      if (partes[3] === 'PM' && h !== 12) h += 12;
      if (partes[3] === 'AM' && h === 12) h = 0;
    }

    if (diaSemana === 0 || !esHoraPermitida(modalidad, diaSemana, h, m)) {
      alert('Cerrado');
      this.value = '';
    } else if (reservados.includes(valor)) {
      alert('Reservado');
      this.value = '';
    }
  });

  // Mostrar modal al hacer clic en reprogramar
  function mostrarPendientes() {
    const contenedor = document.getElementById('tabla-pendientes');
    if (!contenedor) return;
    if (citasPendientes.length === 0) {
      contenedor.innerHTML = '<tr><td colspan="8">No hay citas pendientes.</td></tr>';
      return;
    }
    let html = `
      <tr>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Paciente</th>
        <th>Categoría</th>
        <th>Modalidad</th>
        <th>Pago</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    `;
    citasPendientes.forEach((cita, idx) => {
      html += `
        <tr>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.paciente}</td>
          <td>${cita.categoria}</td>
          <td>${cita.modalidad === 'presencial' ? 'Presencial' : 'Online'}</td>
          <td>${cita.pago}</td>
          <td>${cita.estado}</td>
          <td>
            <button class="btn-confirmar" data-idx="${idx}">Confirmar</button>
            <button class="btn-reprogramar" data-idx="${idx}">Reprogramar</button>
          </td>
        </tr>
      `;
    });
    contenedor.innerHTML = html;

    // Acciones
    contenedor.querySelectorAll('.btn-confirmar').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        citasPendientes[idx].estado = 'Confirmada';
        mostrarPendientes();
      });
    });
    contenedor.querySelectorAll('.btn-reprogramar').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        abrirModalReprogramar(idx);
      });
    });

    // Listener para historial clínico
    contenedor.querySelectorAll('.btn-historial').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-idx');
        abrirModalHistorial(idx);
        document.getElementById('modal-historial-clinico').style.display = 'flex';
      });
    });
  }

  // Cerrar modal
  document.getElementById('cerrar-modal-reprogramar').onclick = cerrarModalReprogramar;
  document.getElementById('cancelar-reprogramar').onclick = cerrarModalReprogramar;

  // Guardar reprogramación
  document.getElementById('form-reprogramar').addEventListener('submit', function(e) {
    e.preventDefault();
    if (citaAReprogramar !== null) {
      const nuevaFecha = document.getElementById('nueva-fecha').value;
      const nuevaHora = document.getElementById('nueva-hora').value;
      const nota = document.getElementById('nota-reprogramar').value;
      citasPendientes[citaAReprogramar].fecha = nuevaFecha;
      citasPendientes[citaAReprogramar].hora = nuevaHora;
      citasPendientes[citaAReprogramar].nota = nota;
      citasPendientes[citaAReprogramar].estado = 'Reprogramada';
      mostrarPendientes();
      cerrarModalReprogramar();
    }
  });

  // Simulación de datos llenados por el paciente (puedes adaptar para cada paciente)
  const historialesPacientes = [
    {
      motivo_consulta: "Ansiedad y estrés laboral",
      sintomas: "Insomnio, irritabilidad, dificultad para concentrarse",
      episodios_previos: "Sí, hace 2 años",
      tiempo_problema: "3 meses",
      desencadenantes: "Cambio de trabajo, aumento de responsabilidades",
      tratamientos_previos: "Ninguno",
      auto_descripcion: "Responsable, perfeccionista, algo ansioso",
      antecedentes_familiares: "Padre con antecedentes de ansiedad",
      desarrollo_psicomotor: "Normal",
      escolaridad: "Universidad completa",
      problemas_afectivos: "Ninguno",
      vida_laboral: "Empleado estable",
      relaciones_interpersonales: "Buenas",
      conducta_sexual: "Sin problemas",
      sumario_diagnostico: "Trastorno de ansiedad generalizada",
      evaluacion_psicologica: "Evaluación dentro de parámetros normales",
      tratamiento: "Terapia cognitivo-conductual",
      evolucion: "Mejoría progresiva",
      cargo_responsable: "Psicólogo clínico",
      universidad_responsable: "Universidad Central"
    },
    {
      motivo_consulta: "Problemas de concentración",
      sintomas: "Olvidos frecuentes, distracción",
      episodios_previos: "No",
      tiempo_problema: "1 mes",
      desencadenantes: "Estrés académico",
      tratamientos_previos: "Ninguno",
      auto_descripcion: "Estudiosa, responsable",
      antecedentes_familiares: "Sin antecedentes",
      desarrollo_psicomotor: "Normal",
      escolaridad: "Secundaria",
      problemas_afectivos: "Ansiedad leve",
      vida_laboral: "Estudiante",
      relaciones_interpersonales: "Pocas amistades",
      conducta_sexual: "Sin actividad",
      sumario_diagnostico: "Dificultad de atención",
      evaluacion_psicologica: "Requiere seguimiento",
      tratamiento: "Técnicas de estudio y relajación",
      evolucion: "En proceso",
      cargo_responsable: "Psicóloga escolar",
      universidad_responsable: "Universidad Nacional"
    }
  ];

  function abrirModalHistorial(idx) {
    const datos = historialesPacientes[idx] || {};
    const preguntas = [
      { label: "Motivo de la consulta", key: "motivo_consulta" },
      { label: "Síntomas", key: "sintomas" },
      { label: "¿Ha tenido episodios previos similares?", key: "episodios_previos" },
      { label: "¿Desde hace cuánto tiempo presenta el problema?", key: "tiempo_problema" },
      { label: "Desencadenantes identificados", key: "desencadenantes" },
      { label: "Tratamientos previos", key: "tratamientos_previos" },
      { label: "¿Cómo se describe usted mismo/a?", key: "auto_descripcion" },
      { label: "Antecedentes familiares relevantes", key: "antecedentes_familiares" },
      { label: "Desarrollo psicomotor", key: "desarrollo_psicomotor" },
      { label: "Escolaridad", key: "escolaridad" },
      { label: "Problemas afectivos", key: "problemas_afectivos" },
      { label: "Vida laboral", key: "vida_laboral" },
      { label: "Relaciones interpersonales", key: "relaciones_interpersonales" },
      { label: "Conducta sexual", key: "conducta_sexual" },
      { label: "Sumario diagnóstico", key: "sumario_diagnostico" },
      { label: "Evaluación psicológica", key: "evaluacion_psicologica" },
      { label: "Tratamiento propuesto", key: "tratamiento" },
      { label: "Evolución", key: "evolucion" },
      { label: "Cargo del responsable", key: "cargo_responsable" },
      { label: "Universidad del responsable", key: "universidad_responsable" }
    ];

    let html = `<div class="tabla-citas-wrapper"><div style="padding:10px 0;">`;
    preguntas.forEach(p => {
      html += `
        <div style="margin-bottom:18px;">
          <div style="font-weight:bold;color:#134E5E;font-size:1.08em;">${p.label}</div>
          <div style="background:#f6f8f6;border-radius:6px;padding:8px 12px;margin-top:4px;color:#222;">
            ${datos[p.key] ? datos[p.key] : '<span style="color:#aaa;">Sin respuesta</span>'}
          </div>
        </div>
      `;
    });
    html += `</div></div>`;

    const contenedor = document.getElementById('historial-clinico-datos');
    if (contenedor) contenedor.innerHTML = html;
    document.getElementById('modal-historial-clinico').style.display = 'flex';
  }

  // Cerrar el modal
  document.getElementById('cerrar-modal-historial').onclick = function() {
    document.getElementById('modal-historial-clinico').style.display = 'none';
  };

  // Validación de formularios (historial e informe)
  document.getElementById('form-historial').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('mensaje-historial').textContent = '¡Historial guardado!';
    document.getElementById('mensaje-historial').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensaje-historial').style.display = 'none';
    }, 2000);
    this.reset();
  });
  document.getElementById('form-informe').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('mensaje-informe').textContent = '¡Informe guardado!';
    document.getElementById('mensaje-informe').style.display = 'block';
    setTimeout(() => {
      document.getElementById('mensaje-informe').style.display = 'none';
    }, 2000);
    this.reset();
  });

  // Mostrar inicio al cargar
  mostrarInicio();

  // Botón principal de pacientes
  document.getElementById('btn-pacientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });

  // Botón del menú lateral de pacientes
  document.getElementById('menu-pacientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pacientes-seccion').style.display = 'block';
    cargarTablaPacientes();
  });

  // Botón informe (menú)
  document.getElementById('menu-informe').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('informe-seccion').style.display = 'block';
  });

  // Botón pendientes (menú)
  document.getElementById('menu-pendientes').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });

  // Botón inicio (menú)
  document.getElementById('menu-inicio').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
  });

  // Botón informe principal
  document.getElementById('btn-informe').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('informe-seccion').style.display = 'block';
  });

  // Botón pendientes principal
  document.getElementById('btn-pendientes').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('pendientes-seccion').style.display = 'block';
    mostrarPendientes();
  });

  function cargarTablaPacientes() {
    const pacientes = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        cedula: '12345678',
        filiacion: {
          primer_nombre: 'Juan',
          segundo_nombre: 'Carlos',
          primer_apellido: 'Pérez',
          segundo_apellido: 'Gómez',
          cedula: '12345678',
          fecha_nacimiento: '1990-01-01',
          lugar_nacimiento: 'Caracas',
          instruccion: 'Universitaria',
          ocupacion: 'Ingeniero',
          estado_civil: 'Soltero',
          religion: 'Católica',
          nombre_conyuge: '',
          telefono_conyuge: '',
          hijos: '2',
          edades_hijos: '5, 8',
          centro_estudio_trabajo: 'Empresa X',
          grado: '',
          lugar_residencia: 'Caracas',
          tiempo_residencia: '10 años',
          procedencia: 'Valencia',
          telefono: '04141234567',
          correo: 'juanperez@email.com'
        },
        familiares: {
          paterno_abuelo: 'Pedro Pérez',
          paterno_abuela: 'María Gómez',
          paterno_padre: 'Luis Pérez',
          paterno_tios: 'José, Andrés',
          materno_abuelo: 'Carlos Gómez',
          materno_abuela: 'Ana Torres',
          materno_madre: 'Lucía Gómez',
          materno_tios: 'Marta, Rosa',
          otros_hermanos: 'Luis',
          otros_esposo: '',
          otros_hijos: '2',
          otros_colaterales: 'Ninguno'
        }
      },
      {
        nombre: 'Ana',
        apellido: 'Gómez',
        cedula: '87654321',
        filiacion: {
          primer_nombre: 'Ana',
          segundo_nombre: '',
          primer_apellido: 'Gómez',
          segundo_apellido: 'Torres',
          cedula: '87654321',
          fecha_nacimiento: '1995-05-10',
          lugar_nacimiento: 'Maracay',
          instruccion: 'TSU',
          ocupacion: 'Estudiante',
          estado_civil: 'Soltera',
          religion: 'Cristiana',
          nombre_conyuge: '',
          telefono_conyuge: '',
          hijos: '',
          edades_hijos: '',
          centro_estudio_trabajo: 'Universidad Y',
          grado: '3er año',
          lugar_residencia: 'Maracay',
          tiempo_residencia: '3 años',
          procedencia: 'Barquisimeto',
          telefono: '04145556666',
          correo: 'anagomez@email.com'
        },
        familiares: {
          paterno_abuelo: '',
          paterno_abuela: '',
          paterno_padre: '',
          paterno_tios: '',
          materno_abuelo: '',
          materno_abuela: '',
          materno_madre: '',
          materno_tios: '',
          otros_hermanos: '',
          otros_esposo: '',
          otros_hijos: '',
          otros_colaterales: ''
        }
      }
    ];
    const tabla = document.getElementById('tabla-pacientes');
    tabla.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Cédula</th>
        <th>Acciones</th>
      </tr>
    `;
    pacientes.forEach((p, idx) => {
      tabla.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.apellido}</td>
          <td>${p.cedula}</td>
          <td>
            <button class="btn-modal btn-historial" data-idx="${idx}">
              <i class="fa-solid fa-notes-medical"></i> Historial clínico
            </button>
          </td>
        </tr>
      `;
    });
    // Guarda los pacientes en window para acceso global
    window._pacientesClinicos = pacientes;

    // Listener SOLO aquí, después de llenar la tabla
    tabla.removeEventListener('click', tabla._historialListener); // Limpia si ya existe
    tabla._historialListener = function(e) {
      const btn = e.target.closest('.btn-historial');
      if (btn) {
        const idx = btn.getAttribute('data-idx');
        if (idx !== null) window.verHistorialPaciente(Number(idx));
      }
    };
    tabla.addEventListener('click', tabla._historialListener);
  }

  window.verHistorialPaciente = function(idx) {
    ocultarSecciones();
    document.getElementById('historial-paciente-seccion').style.display = 'block';
    // Aquí puedes cargar los datos del paciente seleccionado si lo deseas
  };
});
>>>>>>> ee4edeebca7b79e86918c27e87c575e5278733d4
