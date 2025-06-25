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

  // Mostrar solo la sección seleccionada y ocultar los botones principales
  function mostrarSeccion(id) {
    document.getElementById('principal-botones').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(sec => {
      sec.style.display = 'none';
    });
    const s = document.getElementById(id);
    if (s) {
      s.style.display = 'block';
      window.scrollTo({ top: s.offsetTop - 40, behavior: 'smooth' });
    }
  }

  // Botón principal para agendar cita
  document.getElementById('btn-cita').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('cita');
    document.getElementById('form-page-1').style.display = 'block';
    document.getElementById('form-page-2').style.display = 'none';
    document.getElementById('form-page-3').style.display = 'none';
    document.getElementById('form-page-4').style.display = 'none';
  });

  // Navegación entre páginas del formulario
  document.getElementById('btn-continuar').addEventListener('click', function() {
    let valid = true;
    document.querySelectorAll('#form-page-1 input[required], #form-page-1 select[required]').forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    let prevMsg = document.querySelector('#form-page-1 .error-message');
    if (prevMsg) prevMsg.remove();

    if (valid) {
      document.getElementById('form-page-1').style.display = 'none';
      document.getElementById('form-page-2').style.display = 'block';
    } else {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      document.getElementById('form-page-1').appendChild(msg);
      setTimeout(() => { msg.remove(); }, 3000);
    }
  });

  document.getElementById('btn-atras').addEventListener('click', function() {
    document.getElementById('form-page-2').style.display = 'none';
    document.getElementById('form-page-1').style.display = 'block';
  });

  document.getElementById('btn-siguiente-2').addEventListener('click', function() {
    let valid = true;
    document.querySelectorAll('#form-page-2 input[required], #form-page-2 textarea[required]').forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    let prevMsg = document.querySelector('#form-page-2 .error-message');
    if (prevMsg) prevMsg.remove();

    if (valid) {
      document.getElementById('form-page-2').style.display = 'none';
      document.getElementById('form-page-3').style.display = 'block';
    } else {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      document.getElementById('form-page-2').appendChild(msg);
      setTimeout(() => { msg.remove(); }, 3000);
    }
  });

  document.getElementById('btn-atras-3').addEventListener('click', function() {
    document.getElementById('form-page-3').style.display = 'none';
    document.getElementById('form-page-2').style.display = 'block';
  });

  document.getElementById('btn-siguiente-3').addEventListener('click', function() {
    let valid = true;
    document.querySelectorAll('#form-page-3 input[required], #form-page-3 textarea[required]').forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    let prevMsg = document.querySelector('#form-page-3 .error-message');
    if (prevMsg) prevMsg.remove();

    if (valid) {
      document.getElementById('form-page-3').style.display = 'none';
      document.getElementById('form-page-4').style.display = 'block';
    } else {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      document.getElementById('form-page-3').appendChild(msg);
      setTimeout(() => { msg.remove(); }, 3000);
    }
  });

  document.getElementById('btn-atras-4').addEventListener('click', function() {
    document.getElementById('form-page-4').style.display = 'none';
    document.getElementById('form-page-3').style.display = 'block';
  });

  // Submit final SOLO para form-cita
  document.getElementById('form-cita').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Deshabilita todos los inputs/selects/textarea de páginas ocultas
    document.querySelectorAll('.form-page').forEach(page => {
      if (page.style.display === 'none') {
        page.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
      } else {
        page.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
      }
    });

    let valid = true;

    // Valida los campos requeridos de la página 4
    this.querySelectorAll('#form-page-4 input[required], #form-page-4 textarea[required]').forEach(input => {
      if (!input.value.trim()) valid = false;
    });

    // Valida que al menos una fila de la tabla de tratamientos tenga datos
    let algunaFilaLlena = false;
    const filasTratamientos = this.querySelectorAll('#tabla-tratamientos tbody tr');
    filasTratamientos.forEach(tr => {
      const fecha = tr.querySelector('input[type="date"]')?.value.trim();
      const tipo = tr.querySelector('input[type="text"]')?.value.trim();
      if (fecha && tipo) algunaFilaLlena = true;
    });
    if (!algunaFilaLlena) valid = false;

    const mensajeDiv = document.getElementById('mensaje-cita');
    mensajeDiv.style.display = 'none';

    if (valid) {
      // Oculta todas las páginas antes de mostrar el mensaje
      document.getElementById('form-page-1').style.display = 'none';
      document.getElementById('form-page-2').style.display = 'none';
      document.getElementById('form-page-3').style.display = 'none';
      document.getElementById('form-page-4').style.display = 'none';

      mensajeDiv.innerHTML = `
        <div class="success-message">
          ¡Cita agendada exitosamente!<br>
          <button id="btn-aceptar-cita" class="btn-modal" style="margin-top:12px;">Aceptar</button>
        </div>
      `;
      mensajeDiv.style.display = 'block';

      // Evento para el botón aceptar
      setTimeout(() => {
        const btnAceptar = document.getElementById('btn-aceptar-cita');
        if (btnAceptar) {
          btnAceptar.onclick = () => {
            mensajeDiv.style.display = 'none';
            // Limpia el formulario y vuelve a la página 1
            document.getElementById('form-cita').reset();
            document.getElementById('form-page-1').style.display = 'block';
            document.getElementById('form-page-2').style.display = 'none';
            document.getElementById('form-page-3').style.display = 'none';
            document.getElementById('form-page-4').style.display = 'none';
          };
        }
      }, 100);
    } else {
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'Por favor, completa todos los campos obligatorios.';
      this.appendChild(msg);
      setTimeout(() => { msg.remove(); }, 3000);
      document.getElementById('form-page-4').style.display = 'block';
    }
  });

  // Menú superior
  document.getElementById('menu-perfil').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarTodasLasSecciones();
    document.getElementById('principal-botones').style.display = 'flex';
    if (menuList) menuList.style.display = 'none';
  });
  document.getElementById('menu-cita').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('cita');
  });
  document.getElementById('menu-informe').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('informe');
    menuList.style.display = 'none';
  });
  document.getElementById('menu-historial').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('historial');
    menuList.style.display = 'none';
  });
  document.getElementById('menu-mis-citas').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('mis-citas-seccion');
    menuList.style.display = 'none';
  });

  // Validación y mensajes para todos los formularios
  function showMessage(form, type, text) {
    let msg = form.querySelector('.' + type + '-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = type + '-message';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3000);
  }

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

  // Mostrar sección Mis citas
  document.getElementById('btn-mis-citas').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('principal-botones').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(sec => sec.style.display = 'none');
    document.getElementById('mis-citas-seccion').style.display = 'block';
    mostrarMisCitas();
  });

  // Simulación de citas (puedes reemplazar por datos reales)
  const citasEjemplo = [
    {
      fecha: '2025-06-25',
      hora: '10:00 AM',
      paciente: 'Juan Pérez',
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
      contenedor.innerHTML = '<tr><td colspan="7">No tienes citas agendadas.</td></tr>';
      return;
    }
    let html = '';
    citasEjemplo.forEach(cita => {
      html += `
        <tr>
          <td>${cita.fecha}</td>
          <td>${cita.hora}</td>
          <td>${cita.paciente}</td>
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
  document.getElementById('menu-informe').addEventListener('click', function() {
    mostrarHistorialInformes();
  });
  document.getElementById('btn-informe').addEventListener('click', function() {
    mostrarHistorialInformes();
  });

  // Función para ocultar todas las secciones
  function ocultarTodasLasSecciones() {
    document.getElementById('cita').style.display = 'none';
    document.getElementById('informe').style.display = 'none';
    document.getElementById('editar-perfil-seccion').style.display = 'none';
    document.getElementById('mis-citas-seccion').style.display = 'none';
    document.getElementById('historial').style.display = 'none'; // <-- agrega esto
  }

  // Ejemplo para mostrar solo la sección de editar perfil
  document.getElementById('editar-perfil').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarTodasLasSecciones();
    document.getElementById('editar-perfil-seccion').style.display = 'block';
  });

  // Ejemplo para mostrar solo la sección de mis citas
  document.getElementById('btn-mis-citas').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarTodasLasSecciones();
    document.getElementById('mis-citas-seccion').style.display = 'block';
  });

  // Ejemplo para mostrar solo la sección de crear cita
  document.getElementById('btn-cita').addEventListener('click', function(e) {
    e.preventDefault();
    ocultarTodasLasSecciones();
    document.getElementById('cita').style.display = 'block';
    // Mostrar solo la página 1 y ocultar las demás
    document.getElementById('form-page-1').style.display = 'block';
    document.getElementById('form-page-2').style.display = 'none';
    document.getElementById('form-page-3').style.display = 'none';
    document.getElementById('form-page-4').style.display = 'none';
  });

  // Ejemplo para mostrar solo la sección de informe
  document.getElementById('btn-informe').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('informe');
  });

  document.getElementById('form-historial').addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    this.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    const mensajeDiv = document.getElementById('mensaje-historial');
    mensajeDiv.style.display = 'none';

    if (valid) {
      mensajeDiv.textContent = '¡Su historial médico fue registrado exitosamente!';
      mensajeDiv.className = 'success-message';
      mensajeDiv.style.display = 'block';
      setTimeout(() => {
        mensajeDiv.style.display = 'none';
      }, 2000);
    } else {
      mensajeDiv.textContent = 'Por favor, completa todos los campos obligatorios.';
      mensajeDiv.className = 'error-message';
      mensajeDiv.style.display = 'block';
      setTimeout(() => {
        mensajeDiv.style.display = 'none';
      }, 2000);
    }
  });

  document.getElementById('btn-historial').addEventListener('click', function(e) {
    e.preventDefault();
    mostrarSeccion('historial');
  });

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

  // Agregar fila a la tabla de tratamientos
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-agregar-fila')) {
      const tbody = document.querySelector('#tabla-tratamientos tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="date" name="tratamiento_fecha[]"></td>
        <td><input type="text" name="tratamiento_tipo[]"></td>
        <td><button type="button" class="btn-modal btn-agregar-fila">+</button>
            <button type="button" class="btn-modal btn-quitar-fila">-</button></td>
      `;
      tbody.appendChild(tr);
    }
    if (e.target && e.target.classList.contains('btn-quitar-fila')) {
      const tr = e.target.closest('tr');
      if (tr && tr.parentNode.children.length > 1) tr.remove();
    }
  });
});