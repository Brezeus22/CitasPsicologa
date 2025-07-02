document.addEventListener('DOMContentLoaded', function() {
  // Menú desplegable
  const menuToggle = document.getElementById('menu-toggle');
  const menuList = document.getElementById('menu-list');
  if (menuToggle && menuList) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      menuList.style.display = menuList.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !menuList.contains(e.target)) {
        menuList.style.display = 'none';
      }
    });
  }

  // Oculta todas las secciones
  function ocultarTodasLasSecciones() {
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
  }

  // Mostrar solo la sección seleccionada y llenar tabla si es pacientes
  function mostrarSeccion(id) {
    ocultarTodasLasSecciones();
    const s = document.getElementById(id);
    if (s) {
      s.style.display = (id === 'principal-botones') ? 'flex' : 'block';
      if (id === 'pacientes') {
        llenarTablaPacientes();
      }
      if (id === 'mis-citas-seccion') {
        mostrarMisCitas();
      }
      if (id === 'informe') {
        mostrarHistorialInformes();
      }
      // Si es la sección de cita, muestra solo la página 1 y oculta las demás
      if (id === 'cita') {
        document.getElementById('form-page-1').style.display = 'block';
        document.getElementById('form-page-2').style.display = 'none';
        document.getElementById('form-page-3').style.display = 'none';
      }
      window.scrollTo({ top: s.offsetTop - 40, behavior: 'smooth' });
    }
  }

  // Botones principales y menú (usa solo este bloque para navegación)
  [
    ['btn-cita', 'cita'],
    ['btn-informe', 'informe'],
    ['btn-pacientes', 'pacientes'],
    ['btn-mis-citas', 'mis-citas-seccion'],
    ['menu-cita', 'cita'],
    ['menu-informe', 'informe'],
    ['menu-pacientes', 'pacientes'],
    ['menu-mis-citas', 'mis-citas-seccion'],
    ['menu-perfil', 'principal-botones']
  ].forEach(([btnId, secId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSeccion(secId);
      }); 
    }
  });

  // --- HORARIOS Y FECHAS DISPONIBLES SEGÚN MODALIDAD ---
  const modalidad = document.getElementById('modalidad');
  const fecha = document.getElementById('fecha');
  const hora = document.getElementById('hora');

  // Simulación de horarios reservados (puedes reemplazar por tu backend)
  // Formato: { 'YYYY-MM-DD': ['09:00 AM', ...], ... }
  const horariosReservados = {
    '2025-06-13': ['09:00 AM', '06:00 PM'],
    '2025-06-14': ['10:00 AM'],
  };

  // Todas las horas posibles (media hora) de 9:00 AM a 8:00 PM
  function generarTodasLasHoras() {
    const horas = [];
    for (let h = 9; h <= 20; h++) {
      horas.push({ h, m: 0 });
      if (h !== 20) horas.push({ h, m: 30 });
    }
    return horas;
  }

  // Convierte a formato 12h am/pm Venezuela
  function formatoHora(h, m) {
    let sufijo = h < 12 ? 'AM' : 'PM';
    let hora12 = h % 12;
    if (hora12 === 0) hora12 = 12;
    return (
      (hora12 < 10 ? '0' : '') + hora12 + ':' + (m === 0 ? '00' : '30') + ' ' + sufijo
    );
  }

  // Valida si la hora está dentro del horario permitido según modalidad y día
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

  function actualizarHoras() {
    hora.innerHTML = '<option value="">Seleccione</option>';
    const mod = modalidad.value;
    const fechaVal = fecha.value;
    if (!mod || !fechaVal) return;

    const diaSemana = getDayOfWeek(fechaVal);
    const todasHoras = generarTodasLasHoras();
    const reservados = horariosReservados[fechaVal] || [];

    if (diaSemana === 0) {
      // Domingo no hay consulta
      hora.innerHTML = '<option value="">Horario no laborable</option>';
      hora.disabled = true;
      return;
    }
    hora.disabled = false;

    todasHoras.forEach(({ h, m }) => {
      const horaStr = formatoHora(h, m);
      const option = document.createElement('option');
      option.value = horaStr;
      option.textContent = horaStr;

      if (!esHoraPermitida(mod, diaSemana, h, m)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (cerrado)';
      } else if (reservados.includes(horaStr)) {
        option.disabled = true;
        option.className = 'hora-reservada';
        option.textContent += ' (reservado)';
      }
      hora.appendChild(option);
    });
  }

  if (modalidad && fecha && hora) {
    modalidad.addEventListener('change', function() {
      actualizarHoras();
      fecha.value = '';
      hora.innerHTML = '<option value="">Seleccione</option>';
    });
    fecha.addEventListener('change', actualizarHoras);
  }

  // Validar si selecciona un horario reservado o cerrado
  hora.addEventListener('change', function() {
    const fechaVal = fecha.value;
    const diaSemana = getDayOfWeek(fechaVal);
    const mod = modalidad.value;
    const valor = hora.value;
    const reservados = horariosReservados[fechaVal] || [];

    // Buscar la hora seleccionada en formato 24h
    let partes = valor.match(/^(\d+):(\d+) (AM|PM)$/);
    let h = 0, m = 0;
    if (partes) {
      h = parseInt(partes[1], 10);
      m = parseInt(partes[2], 10);
      if (partes[3] === 'PM' && h !== 12) h += 12;
      if (partes[3] === 'AM' && h === 12) h = 0;
    }

    if (diaSemana === 0 || !esHoraPermitida(mod, diaSemana, h, m)) {
      showMessage(form, 'error', 'Cerrado');
      hora.value = '';
    } else if (reservados.includes(valor)) {
      showMessage(form, 'error', 'Reservado');
      hora.value = '';
    }
  });

  // Dinámica de método de pago según modalidad
  const pago = document.getElementById('pago');
  function actualizarPago() {
    const value = modalidad.value;
    pago.innerHTML = '<option value="">Seleccione</option>';
    if (value === 'presencial') {
      pago.innerHTML += '<option value="pago_movil">Pago móvil</option>';
      pago.innerHTML += '<option value="transferencias">Transferencias</option>';
      pago.innerHTML += '<option value="efectivo">Efectivo</option>';
    } else if (value === 'online') {
      pago.innerHTML += '<option value="pago_movil">Pago móvil</option>';
      pago.innerHTML += '<option value="transferencias">Transferencias</option>';
    }
  }
  if (modalidad) modalidad.addEventListener('change', actualizarPago);
  actualizarPago();

  // Menú desplegable de usuario
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

  // --- SECCIÓN EDITAR PERFIL (solo versión página, sin modal ni forms ocultos) ---
  document.getElementById('editar-perfil').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('principal-botones').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById('editar-perfil-seccion').style.display = 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
  });

  document.getElementById('btn-desplegar-usuario').addEventListener('click', function() {
    const div = document.getElementById('desplegable-usuario');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  document.getElementById('btn-desplegar-contrasena').addEventListener('click', function() {
    const div = document.getElementById('desplegable-contrasena');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
  });

  document.getElementById('btn-desplegar-seguridad').addEventListener('click', function() {
    const div = document.getElementById('desplegable-seguridad');
    div.style.display = (div.style.display === 'block') ? 'none' : 'block';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
  });

  document.getElementById('cancelar-editar-perfil').addEventListener('click', function() {
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('principal-botones').style.display = 'flex';
    document.getElementById('desplegable-usuario').style.display = 'none';
    document.getElementById('desplegable-contrasena').style.display = 'none';
    document.getElementById('desplegable-seguridad').style.display = 'none';
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    document.getElementById('mensaje-contrasena').style.display = 'none';
    document.getElementById('pregunta-seguridad').value = '';
    document.getElementById('respuesta-seguridad').value = '';
  });

  document.getElementById('guardar-cambios-perfil').addEventListener('click', function() {
    const usuario = document.getElementById('nuevo-usuario').value.trim();
    const pass1 = document.getElementById('nueva-contrasena').value;
    const pass2 = document.getElementById('confirmar-contrasena').value;
    const mensaje = document.getElementById('mensaje-contrasena');
    const pregunta = document.getElementById('pregunta-seguridad');
    const respuesta = document.getElementById('respuesta-seguridad');

    // Solo valida contraseña si la casilla está visible y el usuario escribió algo
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
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    pregunta.value = '';
    respuesta.value = '';
  });

  // Simulación de descarga de informe
  function descargarInforme() {
    alert('Descargando informe médico...');
    // window.location.href = 'ruta/al/informe.pdf';
  }

  // Simulación de citas (puedes reemplazar por datos reales)
  const citasEjemplo = [
    {
      fecha: '2025-06-25',
      hora: '10:00 AM',
      paciente: 'Juan Pérez',
      cedula: '12345678', // Dato de prueba
      categoria: 'Psicoterapia Individual',
      modalidad: 'online', 
      pago: 'Pago móvil',
      estado: 'En Espera',
      nota: ''
    },
    {
      fecha: '2025-06-28',
      hora: '04:00 PM',
      paciente: 'Ana Gómez',
      cedula: '87654321', // Dato de prueba
      categoria: 'Psicoterapia Infantil',
      modalidad: 'presencial',
      pago: 'Transferencias',
      estado: 'Confirmada',
      nota: 'Por favor, llegar 10 minutos antes.'
    }
  ];

  function mostrarMisCitas() {
    const contenedor = document.getElementById('tabla-mis-citas');
    if (!contenedor) return;
    if (citasEjemplo.length === 0) {
      contenedor.innerHTML = '<tr><td colspan="9">No tienes citas agendadas.</td></tr>';
      return;
    }
    let html = '';
    citasEjemplo.forEach(cita => {
      html += `
        <tr>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.paciente}</td>
          <td>${cita.cedula || ''}</td>
          <td>${cita.categoria}</td>
          <td>${cita.modalidad}</td>
          <td>${cita.pago}</td>
          <td>${cita.estado}</td>
          <td>${cita.nota ? cita.nota : ''}</td>
        </tr>
      `;
    });
    contenedor.innerHTML = html;
  }

  // Simulación de informes médicos guardados
  const informesMedicos = [
    { fecha: '2025-06-01', nombre: 'Informe_01_06_2025.pdf', url: 'informes/Informe_01_06_2025.pdf' },
    { fecha: '2025-05-15', nombre: 'Informe_15_05_2025.pdf', url: 'informes/Informe_15_05_2025.pdf' },
    // Puedes agregar más informes aquí
  ];

  // Función para mostrar el historial de informes
  function mostrarHistorialInformes() {
    const contenedor = document.getElementById('historial-informes');
    if (!contenedor) return;
    if (informesMedicos.length === 0) {
      contenedor.innerHTML = '<p>No hay informes médicos disponibles.</p>';
      return;
    }
    let html = `
      <div class="tabla-citas-wrapper">
        <table class="tabla-citas">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Informe</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
    `;
    informesMedicos.forEach(inf => {
      html += `
        <tr>
          <td>${inf.fecha}</td>
          <td>${inf.nombre}</td>
          <td>
            <a href="${inf.url}" download class="btn-modal">
              Descargar
            </a>
          </td>
        </tr>
      `;
    });
    html += `
          </tbody>
        </table>
      </div>
    `;
    contenedor.innerHTML = html;
  }

  // Mostrar historial de informes al entrar a la sección
  document.getElementById('menu-informe').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('informe');
  });
  document.getElementById('btn-informe').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('informe');
  });

  // --- PACIENTES SPA LOGIC ---
  // Simulación de pacientes (solo con los nuevos campos)
  let pacientes = [
    {
      id: 1,
      primer_nombre: "Juan",
      segundo_nombre: "Carlos",
      primer_apellido: "Pérez",
      segundo_apellido: "Gómez",
      cedula: "12345678",
      fecha_nac: "1994-01-01",
      lugar_nacimiento: "Caracas",
      instruccion: "Universitaria",
      ocupacion: "Ingeniero",
      estado_civil: "Soltero",
      religion: "Católica",
      nombre_conyuge: "",
      telefono_conyuge: "",
      hijos: "1",
      edades_hijos: "5",
      centro_estudio_trabajo: "Empresa X",
      grado: "Licenciado",
      lugar_residencia: "Caracas",
      tiempo_residencia: "5 años",
      procedencia: "Caracas",
      telefono: "04141234567",
      correo: "juan@mail.com",
      historial: {
        fecha: "",
        diagnostico: "",
        tratamiento: "",
        antecedentes: ""
      }
    }
  ];
  let pacienteSeleccionado = null;

  function llenarTablaPacientes() {
    const tbody = document.getElementById('tabla-pacientes');
    if (!tbody) return;
    tbody.innerHTML = "";
    pacientes.forEach((p, idx) => {
      tbody.innerHTML += `
        <tr>
          <td>${p.primer_nombre || ''} ${p.segundo_nombre || ''}</td>
          <td>${p.primer_apellido || ''} ${p.segundo_apellido || ''}</td>
          <td>
            <button class="btn-modal btn-datos-personales" data-idx="${idx}">Datos personales</button>
            <button class="btn-modal btn-historial-medico" data-idx="${idx}">Historial médico</button>
          </td>
        </tr>
      `;
    });
  }

  // Mostrar formulario de datos personales
  document.addEventListener('click', function(e) {
    // Datos personales
    if (e.target.classList.contains('btn-datos-personales')) {
      const idx = e.target.getAttribute('data-idx');
      pacienteSeleccionado = idx;
      const p = pacientes[idx];
      if (!p) return;
      document.getElementById('dp-primer-nombre').value = p.primer_nombre || "";
      document.getElementById('dp-segundo-nombre').value = p.segundo_nombre || "";
      document.getElementById('dp-primer-apellido').value = p.primer_apellido || "";
      document.getElementById('dp-segundo-apellido').value = p.segundo_apellido || "";
      document.getElementById('dp-cedula').value = p.cedula || "";
      document.getElementById('dp-fecha-nac').value = p.fecha_nac || "";
      document.getElementById('dp-lugar-nacimiento').value = p.lugar_nacimiento || "";
      document.getElementById('dp-instruccion').value = p.instruccion || "";
      document.getElementById('dp-ocupacion').value = p.ocupacion || "";
      document.getElementById('dp-estado-civil').value = p.estado_civil || "";
      document.getElementById('dp-religion').value = p.religion || "";
      document.getElementById('dp-nombre-conyuge').value = p.nombre_conyuge || "";
      document.getElementById('dp-telefono-conyuge').value = p.telefono_conyuge || "";
      document.getElementById('dp-hijos').value = p.hijos || "";
      document.getElementById('dp-edades-hijos').value = p.edades_hijos || "";
      document.getElementById('dp-centro-estudio-trabajo').value = p.centro_estudio_trabajo || "";
      document.getElementById('dp-grado').value = p.grado || "";
      document.getElementById('dp-lugar-residencia').value = p.lugar_residencia || "";
      document.getElementById('dp-tiempo-residencia').value = p.tiempo_residencia || "";
      document.getElementById('dp-procedencia').value = p.procedencia || "";
      document.getElementById('dp-telefono').value = p.telefono || "";
      document.getElementById('dp-correo').value = p.correo || "";
      ocultarTodasLasSecciones();
      document.getElementById('form-datos-personales').style.display = 'flex';
      document.getElementById('mensaje-personales').style.display = 'none';
    }
  });

  // Guardar datos personales
  const formDatosPersonales = document.getElementById('form-datos-personales-form');
  if (formDatosPersonales) {
    formDatosPersonales.addEventListener('submit', function(e) {
      e.preventDefault();
      const idx = pacienteSeleccionado;
      const p = pacientes[idx];
      p.primer_nombre = document.getElementById('dp-primer-nombre').value;
      p.segundo_nombre = document.getElementById('dp-segundo-nombre').value;
      p.primer_apellido = document.getElementById('dp-primer-apellido').value;
      p.segundo_apellido = document.getElementById('dp-segundo-apellido').value;
      p.cedula = document.getElementById('dp-cedula').value;
      p.fecha_nac = document.getElementById('dp-fecha-nac').value;
      p.lugar_nacimiento = document.getElementById('dp-lugar-nacimiento').value;
      p.instruccion = document.getElementById('dp-instruccion').value;
      p.ocupacion = document.getElementById('dp-ocupacion').value;
      p.estado_civil = document.getElementById('dp-estado-civil').value;
      p.religion = document.getElementById('dp-religion').value;
      p.nombre_conyuge = document.getElementById('dp-nombre-conyuge').value;
      p.telefono_conyuge = document.getElementById('dp-telefono-conyuge').value;
      p.hijos = document.getElementById('dp-hijos').value;
      p.edades_hijos = document.getElementById('dp-edades-hijos').value;
      p.centro_estudio_trabajo = document.getElementById('dp-centro-estudio-trabajo').value;
      p.grado = document.getElementById('dp-grado').value;
      p.lugar_residencia = document.getElementById('dp-lugar-residencia').value;
      p.tiempo_residencia = document.getElementById('dp-tiempo-residencia').value;
      p.procedencia = document.getElementById('dp-procedencia').value;
      p.telefono = document.getElementById('dp-telefono').value;
      p.correo = document.getElementById('dp-correo').value;
      document.getElementById('mensaje-personales').textContent = "Datos guardados exitosamente.";
      document.getElementById('mensaje-personales').style.display = 'block';
      setTimeout(() => {
        document.getElementById('mensaje-personales').style.display = 'none';
        mostrarSeccion('pacientes');
      }, 1500);
    });
  }
  const cancelarPersonales = document.getElementById('cancelar-personales');
  if (cancelarPersonales) {
    cancelarPersonales.onclick = function() {
      mostrarSeccion('pacientes');
    };
  }

  // Mostrar formulario de historial médico
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-historial-medico')) {
      const idx = e.target.getAttribute('data-idx');
      pacienteSeleccionado = idx;
      const p = pacientes[idx];
      console.log('Click en Historial Médico', { idx, paciente: p });
      if (!p) {
        alert('Paciente no encontrado.');
        return;
      }
      const form = document.getElementById('form-historial-medico');
      if (!form) {
        alert('Formulario de historial médico no encontrado en el DOM.');
        return;
      }
      const h = p.historial || {};
      // Llenar todos los campos del historial médico
      const campos = [
        'hm-paterno-abuelo', 'hm-paterno-abuela', 'hm-paterno-padre', 'hm-paterno-tios',
        'hm-materno-abuelo', 'hm-materno-abuela', 'hm-materno-madre', 'hm-materno-tios',
        'hm-otros-hermanos', 'hm-otros-esposo', 'hm-otros-hijos', 'hm-otros-colaterales'
      ];
      campos.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = h[id.replace('hm-', '').replace(/-/g, '_')] || '';
      });
      ocultarTodasLasSecciones();
      form.style.display = 'flex';
      const mensaje = document.getElementById('mensaje-historial-paciente');
      if (mensaje) mensaje.style.display = 'none';
    }
  });

  // Guardar historial médico
  const formHistorial = document.getElementById('form-historial-paciente');
  if (formHistorial) {
    formHistorial.addEventListener('submit', function(e) {
      e.preventDefault();
      const idx = pacienteSeleccionado;
      pacientes[idx].historial = {
        fecha: document.getElementById('hm-fecha').value,
        diagnostico: document.getElementById('hm-diagnostico').value,
        tratamiento: document.getElementById('hm-tratamiento').value,
        antecedentes: document.getElementById('hm-antecedentes').value,
        paterno_abuelo: document.getElementById('hm-paterno-abuelo').value,
        paterno_abuela: document.getElementById('hm-paterno-abuela').value,
        paterno_padre: document.getElementById('hm-paterno-padre').value,
        paterno_tios: document.getElementById('hm-paterno-tios').value,
        materno_abuelo: document.getElementById('hm-materno-abuelo').value,
        materno_abuela: document.getElementById('hm-materno-abuela').value,
        materno_madre: document.getElementById('hm-materno-madre').value,
        materno_tios: document.getElementById('hm-materno-tios').value,
        otros_hermanos: document.getElementById('hm-otros-hermanos').value,
        otros_esposo: document.getElementById('hm-otros-esposo').value,
        otros_hijos: document.getElementById('hm-otros-hijos').value,
        otros_colaterales: document.getElementById('hm-otros-colaterales').value
      };
      document.getElementById('mensaje-historial-paciente').textContent = "Historial médico guardado exitosamente.";
      document.getElementById('mensaje-historial-paciente').style.display = 'block';
      setTimeout(() => {
        document.getElementById('mensaje-historial-paciente').style.display = 'none';
        mostrarSeccion('pacientes');
      }, 1500);
    });
  }
  const cancelarHistorial = document.getElementById('cancelar-historial');
  if (cancelarHistorial) {
    cancelarHistorial.onclick = function() {
      mostrarSeccion('pacientes');
    };
  }

  // Mostrar formulario para agregar nuevo paciente
  const btnAgregarPaciente = document.getElementById('btn-agregar-paciente');
  if (btnAgregarPaciente) {
    btnAgregarPaciente.onclick = function() {
      ocultarTodasLasSecciones();
      document.getElementById('form-nuevo-paciente').style.display = 'flex';
      document.getElementById('form-nuevo').reset();
      document.getElementById('mensaje-nuevo-paciente').style.display = 'none';
    };
  }
  const cancelarNuevoPaciente = document.getElementById('cancelar-nuevo-paciente');
  if (cancelarNuevoPaciente) {
    cancelarNuevoPaciente.onclick = function() {
      mostrarSeccion('pacientes');
    };
  }

  // Guardar nuevo paciente
  const formNuevo = document.getElementById('form-nuevo');
  if (formNuevo) {
    formNuevo.addEventListener('submit', function(e) {
      e.preventDefault();
      pacientes.push({
        id: Date.now(),
        primer_nombre: document.getElementById('np-primer-nombre').value,
        segundo_nombre: document.getElementById('np-segundo-nombre').value,
        primer_apellido: document.getElementById('np-primer-apellido').value,
        segundo_apellido: document.getElementById('np-segundo-apellido').value,
        cedula: document.getElementById('np-cedula').value,
        nombre: document.getElementById('np-nombre').value,
        apellido: document.getElementById('np-apellido').value,
        fecha_nac: document.getElementById('np-fecha-nac').value,
        lugar_nacimiento: document.getElementById('np-lugar-nacimiento').value,
        instruccion: document.getElementById('np-instruccion').value,
        ocupacion: document.getElementById('np-ocupacion').value,
        estado_civil: document.getElementById('np-estado-civil').value,
        religion: document.getElementById('np-religion').value,
        nombre_conyuge: document.getElementById('np-nombre-conyuge').value,
        telefono_conyuge: document.getElementById('np-telefono-conyuge').value,
        hijos: document.getElementById('np-hijos').value,
        edades_hijos: document.getElementById('np-edades-hijos').value,
        centro_estudio_trabajo: document.getElementById('np-centro-estudio-trabajo').value,
        grado: document.getElementById('np-grado').value,
        lugar_residencia: document.getElementById('np-lugar-residencia').value,
        tiempo_residencia: document.getElementById('np-tiempo_residencia').value,
        procedencia: document.getElementById('np-procedencia').value,
        telefono: document.getElementById('np-telefono').value,
        correo: document.getElementById('np-correo').value,
        historial: {}
      });
      document.getElementById('mensaje-nuevo-paciente').textContent = "Paciente registrado exitosamente.";
      document.getElementById('mensaje-nuevo-paciente').style.display = 'block';
      setTimeout(() => {
        document.getElementById('mensaje-nuevo-paciente').style.display = 'none';
        mostrarSeccion('pacientes');
      }, 1500);
    });
  }

  // Mostrar formulario de datos personales
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-datos-personales')) {
      const idx = e.target.getAttribute('data-idx');
      pacienteSeleccionado = idx;
      const p = pacientes[idx];
      document.getElementById('dp-nombre').value = p.nombre || "";
      document.getElementById('dp-apellido').value = p.apellido || "";
      document.getElementById('dp-edad').value = p.edad || "";
      document.getElementById('dp-fecha-nac').value = p.fecha_nac || "";
      document.getElementById('dp-lugar-nacimiento').value = p.lugar_nacimiento || "";
      document.getElementById('dp-instruccion').value = p.instruccion || "";
      document.getElementById('dp-ocupacion').value = p.ocupacion || "";
      document.getElementById('dp-estado-civil').value = p.estado_civil || "";
      document.getElementById('dp-religion').value = p.religion || "";
      document.getElementById('dp-nombre-conyuge').value = p.nombre_conyuge || "";
      document.getElementById('dp-telefono-conyuge').value = p.telefono_conyuge || "";
      document.getElementById('dp-hijos').value = p.hijos || "";
      document.getElementById('dp-edades-hijos').value = p.edades_hijos || "";
      document.getElementById('dp-centro-estudio-trabajo').value = p.centro_estudio_trabajo || "";
      document.getElementById('dp-grado').value = p.grado || "";
      document.getElementById('dp-lugar-residencia').value = p.lugar_residencia || "";
      document.getElementById('dp-tiempo-residencia').value = p.tiempo_residencia || "";
      document.getElementById('dp-procedencia').value = p.procedencia || "";
      document.getElementById('dp-telefono').value = p.telefono || "";
      document.getElementById('dp-correo').value = p.correo || "";
      ocultarTodasLasSecciones();
      document.getElementById('form-datos-personales').style.display = 'flex';
      document.getElementById('mensaje-personales').style.display = 'none';
    }
  });

  // --- AGENDAR CITA: NAVEGACIÓN ENTRE PÁGINAS DEL FORMULARIO ---
  // Agrega select de paciente dinámicamente
  function llenarSelectPacientesCita() {
    const select = document.getElementById('cita-paciente');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione paciente</option>';
    pacientes.forEach((p, idx) => {
      const nombre = (p.primer_nombre || '') + ' ' + (p.segundo_nombre || '') + ' ' + (p.primer_apellido || '') + ' ' + (p.segundo_apellido || '');
      select.innerHTML += `<option value="${idx}">${nombre.trim()}</option>`;
    });
  }
  // Llenar al mostrar la sección de cita
  const observerCita = new MutationObserver(function(mutations) {
    const citaSec = document.getElementById('cita');
    if (citaSec && citaSec.style.display !== 'none') {
      llenarSelectPacientesCita();
    }
  });
  observerCita.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['style'] });

  function mostrarPaginaCita(num) {
    // Oculta todas las páginas
    document.getElementById('form-page-1').style.display = 'none';
    document.getElementById('form-page-2').style.display = 'none';
    document.getElementById('form-page-3').style.display = 'none';
    // Muestra solo la página correspondiente
    if (num === 1) {
      document.getElementById('form-page-1').style.display = 'block';
    } else if (num === 2) {
      document.getElementById('form-page-2').style.display = 'block';
    } else if (num === 3) {
      document.getElementById('form-page-3').style.display = 'block';
    }
    // Oculta todos los botones de navegación
    const btnContinuar = document.getElementById('btn-continuar');
    const btnSiguiente3 = document.getElementById('btn-siguiente-3');
    const btnAtras1 = document.getElementById('btn-atras-1');
    const btnAtras2 = document.getElementById('btn-atras-2');
    // Mostrar solo los botones correctos
    if (btnContinuar) btnContinuar.style.display = (num === 1) ? 'inline-block' : 'none';
    if (btnSiguiente3) btnSiguiente3.style.display = (num === 2) ? 'inline-block' : 'none';
    if (btnAtras1) btnAtras1.style.display = (num === 2) ? 'inline-block' : 'none';
    if (btnAtras2) btnAtras2.style.display = (num === 3) ? 'inline-block' : 'none';
    // Manejo dinámico del required para el select de paciente
    const selectPaciente = document.getElementById('cita-paciente');
    if (selectPaciente) {
      if (num === 1) {
        selectPaciente.setAttribute('required', 'required');
      } else {
        selectPaciente.removeAttribute('required');
      }
    }
    // Si tienes otros campos multipágina con required, gestiona aquí de forma similar
  }
  // Inicializa en la página 1
  mostrarPaginaCita(1);

  const formCita = document.getElementById('form-cita');
  if (formCita) {
    formCita.addEventListener('submit', function(e) {
      e.preventDefault();
      const mensaje = document.getElementById('mensaje-cita');
      if (mensaje) {
        mensaje.innerHTML = '<div style="text-align:center;">Cita agendada exitosamente.<br><button id="btn-aceptar-cita" class="btn-modal" style="margin-top:12px;">Aceptar</button></div>';
        mensaje.style.display = 'block';
      }
      document.getElementById('form-page-1').style.display = 'none';
      document.getElementById('form-page-2').style.display = 'none';
      document.getElementById('form-page-3').style.display = 'none';
    });
  }
  // Delegación de eventos para el botón aceptar
  // Esto es lo único necesario para que funcione siempre

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-aceptar-cita') {
      const mensaje = document.getElementById('mensaje-cita');
      const formCita = document.getElementById('form-cita');
      if (mensaje && formCita) {
        mensaje.style.display = 'none';
        formCita.reset();
        mostrarPaginaCita(1);
        llenarSelectPacientesCita();
      }
    }
  });

  const btnContinuar = document.getElementById('btn-continuar');
  if (btnContinuar) {
    btnContinuar.addEventListener('click', function(e) {
      e.preventDefault();
      // Validar que los campos requeridos de la página 1 estén completos
      const pacienteVal = document.getElementById('cita-paciente').value;
      const modalidadVal = document.getElementById('modalidad').value;
      const fechaVal = document.getElementById('fecha').value;
      const horaVal = document.getElementById('hora').value;
      const servicioVal = document.getElementById('servicio').value;
      const pagoVal = document.getElementById('pago').value;
      if (!pacienteVal || !modalidadVal || !fechaVal || !horaVal || !servicioVal || !pagoVal) {
        const mensaje = document.getElementById('mensaje-cita');
        if (mensaje) {
          mensaje.textContent = 'Por favor, seleccione un paciente y complete todos los campos obligatorios.';
          mensaje.style.display = 'block';
        }
        return;
      }
      mostrarPaginaCita(2);
      const mensaje = document.getElementById('mensaje-cita');
      if (mensaje) mensaje.style.display = 'none';
    });
  }

  const btnSiguiente3 = document.getElementById('btn-siguiente-3');
  if (btnSiguiente3) {
    btnSiguiente3.addEventListener('click', function(e) {
      e.preventDefault();
      // Validar campos requeridos de página 2
      const motivo = document.querySelector('[name="motivo_consulta"]').value;
      const sintoma = document.querySelector('[name="sintoma"]').value;
      if (!motivo || !sintoma) {
        const mensaje = document.getElementById('mensaje-cita');
        if (mensaje) {
          mensaje.textContent = 'Por favor, complete motivo de consulta y síntoma.';
          mensaje.style.display = 'block';
        }
        return;
      }
      mostrarPaginaCita(3);
      const mensaje = document.getElementById('mensaje-cita');
      if (mensaje) mensaje.style.display = 'none';
    });
  }

  const btnAtras1 = document.getElementById('btn-atras-1');
  if (btnAtras1) {
    btnAtras1.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarPaginaCita(1);
    });
  }

  const btnAtras2 = document.getElementById('btn-atras-2');
  if (btnAtras2) {
    btnAtras2.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarPaginaCita(2);
    });
  }
});

