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
      if (id === 'cita') {
        document.getElementById('form-page-1').style.display = 'block';
        document.getElementById('form-page-2').style.display = 'none';
        document.getElementById('form-page-3').style.display = 'none';
      }
      window.scrollTo({ top: s.offsetTop - 40, behavior: 'smooth' });
    }
  }

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
        // Oculta el menú después de navegar
        if (menuList) menuList.style.display = 'none';
      });
    } else {
      console.warn('No se encontró el botón:', btnId);
    }
  });

  // --- HORARIOS Y FECHAS DISPONIBLES SEGÚN MODALIDAD ---
  const modalidad = document.getElementById('modalidad');
  const fecha = document.getElementById('fecha');
  const hora = document.getElementById('hora');


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
        if ((h >= 9 && h < 12) || (h >= 13 && h < 16)) return true;
      } else if (diaSemana === 6) {
        if (h >= 9 && h < 13) return true;
      }
    } else if (modalidad === 'online') {
      if (diaSemana >= 1 && diaSemana <= 5) {
        if (h >= 18 && h <= 20) return true;
      } else if (diaSemana === 6) {
        if (h >= 16 && h <= 19) return true;
      }
    }
    return false;
  }

  function getDayOfWeek(dateString) {
    return new Date(dateString).getDay();
  }

  function actualizarHoras() {
    hora.innerHTML = '<option value="">Seleccione</option>';
    const mod = modalidad.value;
    const fechaVal = fecha.value;
    if (!mod || !fechaVal) return;

    fetch(`/api/horarios?modalidad=${mod}&fecha=${fechaVal}`)
      .then(res => res.json())
      .then(horasDisponibles => {
        const reservados = horariosReservados?.[fechaVal] || [];
        horasDisponibles.forEach(horaStr => {
          // horaStr viene como "09:00", "13:30", etc.
          let [h, m] = horaStr.split(':');
          h = parseInt(h, 10);
          m = parseInt(m, 10);
          let sufijo = h < 12 ? 'AM' : 'PM';
          let hora12 = h % 12;
          if (hora12 === 0) hora12 = 12;
          let horaMostrar = (hora12 < 10 ? '0' : '') + hora12 + ':' + (m === 0 ? '00' : '30') + ' ' + sufijo;

          const option = document.createElement('option');
          option.value = horaMostrar;
          option.textContent = horaMostrar;

          if (reservados.includes(horaMostrar)) {
            option.disabled = true;
            option.className = 'hora-reservada';
            option.textContent += ' (reservado)';
          }
          hora.appendChild(option);
        });
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

  hora.addEventListener('change', function() {
    const fechaVal = fecha.value;
    const diaSemana = getDayOfWeek(fechaVal);
    const mod = modalidad.value;
    const valor = hora.value;
    const reservados = horariosReservados[fechaVal] || [];

    let partes = valor.match(/^(\d+):(\d+) (AM|PM)$/);
    let h = 0, m = 0;
    if (partes) {
      h = parseInt(partes[1], 10);
      m = parseInt(partes[2], 10);
      if (partes[3] === 'PM' && h !== 12) h += 12;
      if (partes[3] === 'AM' && h === 12) h = 0;
    }

    if (diaSemana === 0 || !esHoraPermitida(mod, diaSemana, h, m)) {
      hora.value = '';
    } else if (reservados.includes(valor)) {
      hora.value = '';
    }
  });

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

  // --- PACIENTES SPA LOGIC ---

  // Listar pacientes
  function llenarTablaPacientes() {
    fetch('/api/pacientes')
      .then(res => res.json())
      .then(pacientes => {
        const tbody = document.getElementById('tabla-pacientes');
        if (!tbody) return;
        tbody.innerHTML = "";
        pacientes.forEach((p) => {
          tbody.innerHTML += `
            <tr>
              <td>${p.primer_nombre || ''} ${p.segundo_nombre || ''}</td>
              <td>${p.primer_apellido || ''} ${p.segundo_apellido || ''}</td>
              <td>
                <button class="btn-modal btn-datos-personales" data-id="${p.id_paciente}">Datos personales</button>
                <button class="btn-modal btn-historial-med
              </td>
            </tr>
          `;
        });
      });
  }

  // Crear paciente
  function crearPaciente(data) {
    fetch('/api/paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        alert('Paciente agregado correctamente');
        // Opcional: recargar la lista de pacientes o limpiar el formulario
      } else {
        alert('Error al agregar paciente');
      }
    });
  }

  // Editar paciente
  function guardarDatosPaciente(id) {
    const data = {
      primer_nombre: document.getElementById('dp-primer-nombre').value,
      segundo_nombre: document.getElementById('dp-segundo-nombre').value,
      primer_apellido: document.getElementById('dp-primer-apellido').value,
      segundo_apellido: document.getElementById('dp-segundo-apellido').value,
      cedula: document.getElementById('dp-cedula').value,
      fecha_de_nacimiento: document.getElementById('dp-fecha-nac').value,
      lugar_nacimiento: document.getElementById('dp-lugar-nacimiento').value,
      instruccion: document.getElementById('dp-instruccion').value,
      ocupacion: document.getElementById('dp-ocupacion').value,
      estado_civil: document.getElementById('dp-estado-civil').value,
      religion: document.getElementById('dp-religion').value,
      nombre_conyuge: document.getElementById('dp-nombre-conyuge').value,
      telefono_conyuge: document.getElementById('dp-telefono-conyuge').value,
      hijos: document.getElementById('dp-hijos').value,
      edades_hijos: document.getElementById('dp-edades-hijos').value,
      "centro_estudio_y/o_trabajo": document.getElementById('dp-centro-estudio-trabajo').value,
      grado: document.getElementById('dp-grado').value,
      lugar_residencia: document.getElementById('dp-lugar-residencia').value,
      tiempo_residencia: document.getElementById('dp-tiempo-residencia').value,
      procedencia: document.getElementById('dp-procedencia').value,
      telefono: document.getElementById('dp-telefono').value,
      correo: document.getElementById('dp-correo').value
    };
    fetch(`/api/paciente/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(resp => {
        if (resp.success) {
          alert('Datos guardados');
          llenarTablaPacientes();
        }
      });
  }

  // Mostrar formulario de datos personales
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-datos-personales')) {
      const id = e.target.getAttribute('data-id');
      fetch(`/api/paciente/${id}`)
        .then(res => res.json())
        .then(p => {
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
          document.getElementById('form-datos-personales-form').onsubmit = function(ev) {
            ev.preventDefault();
            guardarDatosPaciente(id);
          };
        });
    }
  });

  // Mostrar formulario de historial médico
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-historial-medico')) {
      const id = e.target.getAttribute('data-id');
      fetch(`/api/historial/${id}`)
        .then(res => res.json())
        .then(historial => {
          if (historial.length > 0) {
            document.getElementById('input-motivo-consulta').value = historial[0].motivo_consulta || '';
            document.getElementById('input-diagnostico').value = historial[0].diagnostico || '';
            document.getElementById('input-tratamiento').value = historial[0].tratamiento || '';
            document.getElementById('input-antecedentes').value = historial[0].antecedentes || '';
          }
          ocultarTodasLasSecciones();
          document.getElementById('form-historial-medico').style.display = 'flex';
          document.getElementById('mensaje-historial-paciente').style.display = 'none';
          document.getElementById('form-historial-paciente').onsubmit = function(ev) {
            ev.preventDefault();
            guardarHistorialPaciente(id);
          };
        });
    }
  });

  // Guardar nuevo paciente
  const formNuevo = document.getElementById('form-nuevo');
  if (formNuevo) {
    formNuevo.addEventListener('submit', async function(e) {
      e.preventDefault();

      // 1. Obtener el usuario actual
      let id_usuario = null;
      try {
        const res = await fetch('/api/usuario');
        const user = await res.json();
        if (user && user.id_usuario) {
          id_usuario = user.id_usuario;
        } else {
          alert('No se pudo obtener el usuario actual');
          return;
        }
      } catch (err) {
        alert('Error al obtener usuario actual');
        return;
      }

      // 2. Recolectar los datos del formulario
      const data = {
        primer_nombre: document.getElementById('np-primer-nombre').value,
        segundo_nombre: document.getElementById('np-segundo-nombre').value,
        primer_apellido: document.getElementById('np-primer-apellido').value,
        segundo_apellido: document.getElementById('np-segundo-apellido').value,
        cedula: document.getElementById('np-cedula').value,
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
        // Agrega otros campos si tienes más
        id_usuario: id_usuario // 3. Relacionar con el usuario actual
      };

      // 4. Enviar al backend
      crearPaciente(data);
    });
  }

  let pacienteSeleccionado = '';

  function llenarSelectPacientesCita() {
    fetch('/api/pacientes')
      .then(res => res.json())
      .then(pacientes => {
        const select = document.getElementById('cita-paciente');
        if (!select) return;
        select.innerHTML = '<option value="">Seleccione paciente</option>';
        pacientes.forEach((p) => {
          const nombre = `${p.primer_nombre || ''} ${p.segundo_nombre || ''} ${p.primer_apellido || ''} ${p.segundo_apellido || ''}`.trim();
          select.innerHTML += `<option value="${p.id_paciente}">${nombre}</option>`;
        });
        // Restaurar selección si existe
        if (pacienteSeleccionado) {
          select.value = pacienteSeleccionado;
        }
        // Guardar selección al cambiar
        select.addEventListener('change', function() {
          pacienteSeleccionado = select.value;
        });
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

  // Citas
  function mostrarMisCitas() {
    fetch('/api/citas')
      .then(res => res.json())
      .then(citas => {
        const tabla = document.querySelector('#mis-citas-seccion .tabla-citas');
        if (!tabla) return;
        tabla.innerHTML = `
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Servicio</th>
            <th>Modalidad</th>
            <th>Pago</th>
            <th>Estado</th>
          </tr>
        `;
        citas.forEach(cita => {
          tabla.innerHTML += `
            <tr>
              <td>${cita.fecha_cita || ''}</td>
              <td>${cita.hora_cita || ''}</td>
              <td>${(cita.primer_nombre || '') + ' ' + (cita.primer_apellido || '')}</td>
              <td>${cita.servicio || ''}</td>
              <td>${cita.modalidad || ''}</td>
              <td>${cita.metodo_pago || ''}</td>
              <td>${cita.Status || ''}</td>
            </tr>
          `;
        });
      });
  }

  function crearCita(datosCita) {
    const idPaciente = document.getElementById('cita-paciente').value;
    if (!idPaciente) {
      alert('Debes seleccionar un paciente');
      return;
    }
    datosCita.id_paciente = idPaciente;
    fetch('/api/cita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosCita)
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        alert('Cita creada correctamente');
        mostrarMisCitas();
      } else {
        alert('Error al crear cita');
      }
    });
  }

  // Obtener datos del usuario y llenar el formulario de perfil
  function cargarPerfilUsuario() {
    fetch('/api/usuario')
      .then(res => res.json())
      .then(user => {
        if (user.error) return;
        document.getElementById('input-correo').value = user.correo || '';
        document.getElementById('input-nombre-usuario').value = user.nombre_usuario || '';
        document.getElementById('input-primer-nombre').value = user.Primer_Nombre || '';
        document.getElementById('input-primer-apellido').value = user.Primer_Apellido || '';
      });
  }

  // Guardar cambios de perfil
  function guardarPerfilUsuario() {
    const data = {
      correo: document.getElementById('input-correo').value,
      nombre_usuario: document.getElementById('input-nombre-usuario').value,
      contraseña: document.getElementById('input-contrasena').value
    };
    fetch('/api/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(resp => {
        if (resp.success) alert('Perfil actualizado');
      });
  }

  // Obtener historial de un paciente
  function cargarHistorialPaciente(id_paciente) {
    fetch(`/api/historial/${id_paciente}`)
      .then(res => res.json())
      .then(historial => {
        if (historial.length > 0) {
          document.getElementById('input-motivo-consulta').value = historial[0].motivo_consulta || '';
          document.getElementById('input-diagnostico').value = historial[0].diagnostico || '';
          document.getElementById('input-tratamiento').value = historial[0].tratamiento || '';
          document.getElementById('input-antecedentes').value = historial[0].antecedentes || '';
        }
      });
  }

  function guardarHistorialPaciente(id_paciente) {
    const data = {
      motivo_consulta: document.getElementById('input-motivo-consulta').value,
      diagnostico: document.getElementById('input-diagnostico').value,
      tratamiento: document.getElementById('input-tratamiento').value,
      antecedentes: document.getElementById('input-antecedentes').value
    };
    fetch(`/api/historial/${id_paciente}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(resp => {
        if (resp.success) {
          alert('Historial guardado');
        }
      });
  }

  // Navegación del formulario de crear cita
  const btnContinuar = document.getElementById('btn-continuar');
  const page1 = document.getElementById('form-page-1');
  const page2 = document.getElementById('form-page-2');
  const btnAtras1 = document.getElementById('btn-atras-1');
  const page3 = document.getElementById('form-page-3');
  const btnAtras2 = document.getElementById('btn-atras-2');
  const btnSiguiente3 = document.getElementById('btn-siguiente-3');

  if (btnContinuar && page1 && page2) {
    btnContinuar.addEventListener('click', function(e) {
      e.preventDefault();
      page1.style.display = 'none';
      page2.style.display = 'block';
      setRequiredFields('form-page-2');
    });
  }
  if (btnAtras1 && page1 && page2) {
    btnAtras1.addEventListener('click', function(e) {
      e.preventDefault();
      page2.style.display = 'none';
      page1.style.display = 'block';
      setRequiredFields('form-page-1');
    });
  }
  if (btnSiguiente3 && page2 && page3) {
    btnSiguiente3.addEventListener('click', function(e) {
      e.preventDefault();
      page2.style.display = 'none';
      page3.style.display = 'block';
      setRequiredFields('form-page-3');
    });
  }
  if (btnAtras2 && page2 && page3) {
    btnAtras2.addEventListener('click', function(e) {
      e.preventDefault();
      page3.style.display = 'none';
      page2.style.display = 'block';
      setRequiredFields('form-page-2');
    });
  }

  const formCita = document.getElementById('form-cita');
  if (formCita) {
    formCita.addEventListener('submit', function(e) {
      e.preventDefault();

      // Recolectar datos de todas las páginas del formulario
      const datosCita = {
        id_paciente: document.getElementById('cita-paciente')?.value,
        modalidad: document.getElementById('modalidad')?.value,
        fecha_cita: document.getElementById('fecha')?.value,
        hora_cita: document.getElementById('hora')?.value,
        servicio: document.getElementById('servicio')?.value, // <--- debe llamarse servicio
        metodo_pago: document.getElementById('pago')?.value,
        motivo_consulta: document.querySelector('[name="motivo_consulta"]')?.value,
        sintoma: document.querySelector('[name="sintoma"]')?.value,
        tiempo_problema: document.querySelector('[name="tiempo_problema"]')?.value,
        factores_desencadenantes: document.querySelector('[name="factores_desencadenantes"]')?.value,
        tratamientos: Array.from(document.querySelectorAll('#tabla-tratamientos tbody tr')).map(tr => ({
          fecha: tr.querySelector('input[name="tratamiento_fecha[]"]')?.value,
          tipo: tr.querySelector('input[name="tratamiento_tipo[]"]')?.value
        })),
        auto_descripcion: document.querySelector('[name="auto_descripcion"]')?.value
      };

      console.log('ID PACIENTE:', datosCita.id_paciente, typeof datosCita.id_paciente);

      fetch('/api/cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCita)
      })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          alert('Cita agendada correctamente');
          // Opcional: recargar o mostrar otra sección
        } else {
          alert('Error al agendar cita');
        }
      })
      .catch(() => alert('Error de conexión con el servidor'));
    });
  }

  function setRequiredFields(pageId) {
    // Quita required de todos los campos de todas las páginas
    document.querySelectorAll('.form-page input, .form-page select, .form-page textarea').forEach(el => {
      el.required = false;
    });
    // Agrega required solo a los campos visibles de la página actual
    document.querySelectorAll(`#${pageId} input, #${pageId} select, #${pageId} textarea`).forEach(el => {
      if (el.hasAttribute('data-original-required') || el.required) {
        el.required = true;
      }
    });
  }
  setRequiredFields('form-page-1');

  const horariosReservados = {}; // <-- Añade esto antes de cualquier uso

  // --- MENÚ DESPLEGABLE DE USUARIO ---
  const userIconBtn = document.getElementById('user-icon-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  if (userIconBtn && userDropdownMenu) {
    userIconBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userDropdownMenu.style.display = userDropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    // Oculta el menú si se hace clic fuera
    document.addEventListener('click', function(e) {
      if (!userDropdownMenu.contains(e.target) && !userIconBtn.contains(e.target)) {
        userDropdownMenu.style.display = 'none';
      }
    });
  }

  // --- BOTÓN EDITAR PERFIL ---
  const btnEditarPerfil = document.getElementById('editar-perfil');
  if (btnEditarPerfil) {
    btnEditarPerfil.addEventListener('click', function(e) {
      e.preventDefault();
      ocultarTodasLasSecciones();
      const seccionEditar = document.getElementById('editar-perfil-seccion');
      if (seccionEditar) {
        seccionEditar.style.display = 'block';
      }
      // Si quieres cargar datos del usuario aquí, llama a tu función:
      if (typeof cargarPerfilUsuario === 'function') {
        cargarPerfilUsuario();
      }
      // Oculta el menú de usuario si está abierto
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
    });
  }

  // --- BOTÓN CERRAR SESIÓN ---
  const btnCerrarSesion = document.getElementById('cerrar-sesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/';
    });
  }

  // Desplegables de editar perfil
  document.getElementById('btn-desplegar-usuario')?.addEventListener('click', function() {
    const d = document.getElementById('desplegable-usuario');
    if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('btn-desplegar-contrasena')?.addEventListener('click', function() {
    const d = document.getElementById('desplegable-contrasena');
    if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('btn-desplegar-seguridad')?.addEventListener('click', function() {
    const d = document.getElementById('desplegable-seguridad');
    if (d) d.style.display = d.style.display === 'block' ? 'none' : 'block';
  });

  // Mostrar campos según selección
  document.getElementById('tipo-cambio-usuario')?.addEventListener('change', function() {
    const tipo = this.value;
    document.getElementById('nuevo-usuario').style.display = tipo === 'usuario' ? 'block' : 'none';
    document.getElementById('nuevo-correo').style.display = tipo === 'correo' ? 'block' : 'none';
  });

  // Guardar cambios de perfil
  document.getElementById('guardar-cambios-perfil')?.addEventListener('click', function() {
    // Recolectar datos a actualizar
    const tipoCambio = document.getElementById('tipo-cambio-usuario')?.value;
    const nuevoUsuario = document.getElementById('nuevo-usuario')?.value.trim();
    const nuevoCorreo = document.getElementById('nuevo-correo')?.value.trim();
    const nuevaContrasena = document.getElementById('nueva-contrasena')?.value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena')?.value;
    const pregunta = document.getElementById('pregunta-seguridad')?.value;
    const respuesta = document.getElementById('respuesta-seguridad')?.value.trim();

    let data = {};
    if (tipoCambio === 'usuario' && nuevoUsuario) data.nombre_usuario = nuevoUsuario;
    if (tipoCambio === 'correo' && nuevoCorreo) data.correo = nuevoCorreo;
    if (nuevaContrasena || confirmarContrasena) {
      if (nuevaContrasena !== confirmarContrasena) {
        document.getElementById('mensaje-contrasena').textContent = 'Las contraseñas no coinciden';
        document.getElementById('mensaje-contrasena').style.display = 'block';
        return;
      }
      data.contraseña = nuevaContrasena;
    }
    if (pregunta && respuesta) {
      data.pregunta = pregunta;
      data.respuesta = respuesta;
    }

    if (Object.keys(data).length === 0) {
      alert('No hay cambios para guardar');
      return;
    }

    fetch('/api/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        alert('Perfil actualizado correctamente');
        // Limpia campos y oculta seccion
        document.getElementById('editar-perfil-seccion').style.display = 'none';
        document.getElementById('nuevo-usuario').value = '';
        document.getElementById('nuevo-correo').value = '';
        document.getElementById('nueva-contrasena').value = '';
        document.getElementById('confirmar-contrasena').value = '';
        document.getElementById('respuesta-seguridad').value = '';
        document.getElementById('mensaje-contrasena').style.display = 'none';
      } else {
        alert('Error al actualizar perfil');
      }
    });
  });

  // Cancelar edición
  document.getElementById('cancelar-editar-perfil')?.addEventListener('click', function() {
    document.getElementById('editar-perfil-seccion').style.display = 'none';
  });

   // Mostrar formulario de nuevo paciente
  const btnAgregarPaciente = document.getElementById('btn-agregar-paciente');
  if (btnAgregarPaciente) {
    btnAgregarPaciente.addEventListener('click', function() {
      ocultarTodasLasSecciones();
      document.getElementById('form-nuevo-paciente').style.display = 'flex';
      // Limpia el formulario si es necesario
      document.getElementById('form-nuevo').reset();
      document.getElementById('mensaje-nuevo-paciente').style.display = 'none';
    });
  }

});

