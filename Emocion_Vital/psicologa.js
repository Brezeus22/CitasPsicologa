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
  document.getElementById('btn-historial').addEventListener('click', function() {
    ocultarSecciones();
    document.getElementById('historial-seccion').style.display = 'block';
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
  document.getElementById('menu-historial').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('historial-seccion').style.display = 'block';
  });
  document.getElementById('menu-informe').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarSecciones();
    document.getElementById('informe-seccion').style.display = 'block';
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
            <button class="btn-historial" data-idx="${idx}">Historial clínico</button>
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
});

