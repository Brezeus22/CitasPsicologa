from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, session
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from flask import make_response, abort
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='.', template_folder='.')
app.secret_key = 'supersecretkey'  # Necesario para usar sesiones

# Configuración de la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'emocionvital_db'
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost/emocionvital_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- MODELOS ---

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id_usuario = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(255), nullable=False)
    nombre_usuario = db.Column(db.String(255), nullable=False)
    Primer_Nombre = db.Column(db.String(255))
    Primer_Apellido = db.Column(db.String(255))
    contraseña = db.Column(db.String(255), nullable=False)
    primera_pregunta = db.Column('1era_pregunta', db.String(255))
    primera_respuesta = db.Column('1era_respuesta', db.String(255))
    segunda_pregunta = db.Column('2da_pregunta', db.String(255))
    segunda_respuesta = db.Column('2da_respuesta', db.String(255))
    tipo_usuario = db.Column(db.String(50))
    status = db.Column(db.String(50))

class Paciente(db.Model):
    __tablename__ = 'paciente'
    id_paciente = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer)
    primer_nombre = db.Column(db.String(255))
    segundo_nombre = db.Column(db.String(255))
    primer_apellido = db.Column(db.String(255))
    segundo_apellido = db.Column(db.String(255))
    cedula = db.Column(db.String(20))
    fecha_de_nacimiento = db.Column(db.Date)
    lugar_nacimiento = db.Column(db.String(255))
    instruccion = db.Column(db.String(255))
    ocupacion = db.Column(db.String(255))
    estado_civil = db.Column(db.String(50))
    religion = db.Column(db.String(255))
    nombre_conyuge = db.Column(db.String(255))
    telefono_conyuge = db.Column(db.String(50))
    hijos = db.Column(db.String(10))
    centro_estudio_y_o_trabajo = db.Column(db.String(255))
    grado = db.Column(db.String(255))
    tiempo_residencia = db.Column(db.String(10))
    sexo = db.Column(db.String(20))
    telefono = db.Column(db.String(50))
    correo = db.Column(db.String(255))
    direccion = db.Column(db.String(255))
    id_estado = db.Column(db.Integer)
    id_municipio = db.Column(db.Integer)
    id_parroquia = db.Column(db.Integer)
    status = db.Column(db.String(20))

class Cita(db.Model):
    __tablename__ = 'cita'
    id_cita = db.Column(db.Integer, primary_key=True)
    id_paciente = db.Column(db.Integer, nullable=False)
    id_psicologa = db.Column(db.Integer, nullable=False)
    id_horario = db.Column(db.Integer, nullable=False)
    modalidad = db.Column(db.Enum('online', 'presencial'), nullable=False)
    servicio = db.Column(db.Enum(
        'psicoterapia_infantil',
        'psicoterapia_adolescentes',
        'psicoterapia_individual',
        'psicoterapia_parejas'
    ), nullable=False)
    fecha_cita = db.Column(db.Date, nullable=False)
    hora_cita = db.Column(db.Time, nullable=False)
    metodo_pago = db.Column(db.Enum('pago_movil', 'transferencias', 'efectivo'), nullable=False)
    Status = db.Column(db.Enum('Confirmada', 'Cancelada', 'Reprogramada'), nullable=False)

class HistorialMedico(db.Model):
    __tablename__ = 'historial_medico'
    id_historial_medico = db.Column(db.Integer, primary_key=True)
    id_paciente = db.Column(db.Integer)
    fecha_consulta = db.Column(db.Date)
    diagnostico = db.Column(db.String(255))
    tratamiento = db.Column(db.String(255))
    antecedentes = db.Column(db.String(255))
    fecha_registro = db.Column(db.DateTime)
    status = db.Column(db.Enum('Registrado','Actualizado','Inactivo'))

class HistoriaClinicaPsicologia(db.Model):
    __tablename__ = 'historia_clinica_psicologia'
    id_historia_clinica = db.Column(db.Integer, primary_key=True)
    id_paciente = db.Column(db.Integer)
    entrevistador = db.Column(db.String(255))
    fecha_consulta = db.Column(db.Date)
    motivo_consulta = db.Column(db.String(255))
    sintomas = db.Column(db.String(255))
    episodios_previos = db.Column(db.String(255))
    tiempo_problema = db.Column(db.String(255))
    desencadenantes = db.Column(db.String(255))
    tratamientos_previos = db.Column(db.String(255))
    auto_descripcion = db.Column(db.String(255))
    antecedentes_familiares = db.Column(db.String(255))
    desarrollo_psicomotor = db.Column(db.String(255))
    escolaridad = db.Column(db.String(255))
    problemas_afectivos = db.Column(db.String(255))
    vida_laboral = db.Column(db.String(255))
    relaciones_interpersonales = db.Column(db.String(255))
    conducta_sexual = db.Column(db.String(255))
    sumario_diagnostico = db.Column(db.String(255))
    evaluacion_psicologica = db.Column(db.String(255))
    tratamiento = db.Column(db.String(255))
    evolucion = db.Column(db.String(255))
    firma_responsable = db.Column(db.String(255))
    cargo_responsable = db.Column(db.String(255))
    universidad_responsable = db.Column(db.String(255))

class Horario(db.Model):
    __tablename__ = 'horario'
    id_horario = db.Column(db.Integer, primary_key=True)
    id_psicologa = db.Column(db.Integer)
    dias_laborables = db.Column(db.String(255))
    horario_laboral = db.Column(db.String(255))
    status = db.Column(db.Enum('Activo','Inactivo','Pendiente'))

class InformeMedico(db.Model):
    __tablename__ = 'informe_medico'
    id_informe_medico = db.Column(db.Integer, primary_key=True)
    id_paciente = db.Column(db.Integer)
    id_psicologa = db.Column(db.Integer)
    id_cita = db.Column(db.Integer)
    fecha_informe = db.Column(db.Date)
    motivo_consulta = db.Column(db.String(255))
    evaluacion_psicologica = db.Column(db.String(255))
    diagnostico = db.Column(db.String(255))
    recomendaciones = db.Column(db.String(255))
    conclusiones = db.Column(db.String(255))
    status = db.Column(db.Enum('Registrado','Actualizado','Inactivo'))

class Estado(db.Model):
    __tablename__ = 'estados'
    id_estado = db.Column(db.Integer, primary_key=True)
    estado = db.Column(db.String(100))
    iso_3166_2 = db.Column(db.String(4))

class Municipio(db.Model):
    __tablename__ = 'municipios'
    id_municipio = db.Column(db.Integer, primary_key=True)
    id_estado = db.Column(db.Integer)
    municipio = db.Column(db.String(100))

class Ciudad(db.Model):
    __tablename__ = 'ciudades'
    id_ciudad = db.Column(db.Integer, primary_key=True)
    id_estado = db.Column(db.Integer)
    ciudad = db.Column(db.String(100))
    capital = db.Column(db.Boolean)

class Parroquia(db.Model):
    __tablename__ = 'parroquias'
    id_parroquia = db.Column(db.Integer, primary_key=True)
    id_municipio = db.Column(db.Integer)
    parroquia = db.Column(db.String(250))

class PacienteCita(db.Model):
    __tablename__ = 'paciente_cita'
    id_paciente_cita = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum('Activo','Inactivo','Pendiente'))

def get_db_connection():
    return mysql.connector.connect(**db_config)

# Rutas principales
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/contacto')
def contacto():
    return render_template('index.html')

@app.route('/inicio-sesion', methods=['GET'])
def inicio_sesion():
    return render_template('Inicio-Sesion.html')

# Ruta para procesar el inicio de sesión
@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('name-1')
    password = request.form.get('text')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM usuarios 
        WHERE (nombre_usuario = %s OR correo = %s) AND status = 'activo'
    """, (username, username))
    user = cursor.fetchone()

    if user and check_password_hash(user['contraseña'], password):
        session['rol'] = user['tipo_usuario']
        session['id_usuario'] = user['id_usuario']  # Guarda el id_usuario en sesión

        # Si el usuario es paciente, busca su registro en paciente y guarda el id_paciente
        if user['tipo_usuario'] == 'paciente':
            cursor.execute("SELECT id_paciente FROM paciente WHERE id_usuario = %s", (user['id_usuario'],))
            paciente = cursor.fetchone()
            if paciente:
                session['id_paciente'] = paciente['id_paciente']
            else:
                session['id_paciente'] = None  # No tiene paciente asociado

        cursor.close()
        conn.close()
        if user['tipo_usuario'] == 'psicologa':
            return redirect(url_for('psicologa'))
        else:
            return redirect(url_for('perfil'))
    else:
        cursor.close()
        conn.close()
        return render_template('Inicio-Sesion.html', error='Usuario o contraseña incorrectos')

#Para los inicios de sesion, para paciente usuario:juanp y contraseña:123456
# Para psicóloga usuario:mmogollon y contraseña:admin
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        data = request.form
        try:
            hashed_password = generate_password_hash(data.get('password'))
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO usuarios (
                    correo, nombre_usuario, Primer_Nombre, Primer_Apellido, contraseña, 
                    1era_pregunta, 1era_respuesta, 2da_pregunta, 2da_respuesta, tipo_usuario, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'paciente', 'activo')
            """, (
                data.get('email'),
                data.get('username'),
                data.get('name'),
                data.get('name-1'),
                hashed_password,
                'Color Favorito',
                data.get('color-favorito'),
                'Animal Favorito',
                data.get('animal-favorito')
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return render_template('Inicio-Sesion.html', error='Registro exitoso. Inicie sesión.')
        except Exception as e:
            return render_template('registro.html', error=f'Error: {str(e)}')
    else:
        return render_template('registro.html')

@app.route('/sobre-nosotros')
def sobre_nosotros():
    return render_template('Sobre_Nosotros.html') 

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')

@app.route('/psicologa')
def psicologa():
    return render_template('psicologa.html')

# Ruta para servir archivos estáticos (CSS, imágenes, etc.)
@app.route('/<path:filename>')
def static_files(filename):
    # Lista de extensiones permitidas (puedes ampliarla)
    allowed_extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif']
    
    # Verificar que el archivo solicitado tiene extensión permitida
    if not any(filename.lower().endswith(ext) for ext in allowed_extensions):
        return "Acceso no permitido", 403
    
    return send_from_directory('.', filename)

# Ruta para manejar el formulario de contacto
@app.route('/contacto', methods=['POST'])
def contacto_post():
    if request.method == 'POST':
        try:
            data = request.form
            
            # Validar campos requeridos
            required_fields = ['email', 'name', 'address', 'message']
            if not all(field in data for field in required_fields):
                return jsonify({'success': False, 'message': 'Faltan campos requeridos'}), 400
            
            # Configurar y enviar email
            msg = MIMEMultipart()
            msg['From'] = app.config['MAIL_USERNAME']
            msg['To'] = app.config['MAIL_RECIPIENT']
            msg['Subject'] = f"Nuevo mensaje de {data['name']}"
            
            body = f"""
            Nombre: {data['name']}
            Email: {data['email']}
            Dirección: {data['address']}
            
            Mensaje:
            {data['message']}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Enviar email (comentado por defecto para pruebas)
            """
            with smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT']) as server:
                server.starttls()
                server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
                server.send_message(msg)
            """
            
            # Solo para demostración - imprime en consola
            print("\n--- Nuevo mensaje de contacto ---")
            print(body)
            print("--------------------------------")
            
            return jsonify({
                'success': True, 
                'message': 'Gracias! Tu mensaje ha sido enviado.'
            })
            
        except Exception as e:
            return jsonify({
                'success': False, 
                'message': f'Error al procesar tu mensaje: {str(e)}'
            }), 500

# --- USUARIO (PERFIL) ---
@app.route('/api/usuario', methods=['GET', 'POST'])
def api_usuario():
    if 'id_usuario' not in session:
        return jsonify({'error': 'No autenticado'}), 401
    id_usuario = session['id_usuario']
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if request.method == 'GET':
        cursor.execute("SELECT correo, nombre_usuario, Primer_Nombre, Primer_Apellido, 1era_pregunta, 1era_respuesta, 2da_pregunta, 2da_respuesta FROM usuarios WHERE id_usuario = %s", (id_usuario,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if not user:
            return jsonify({'error': 'Usuario no encontrado'})
        return jsonify(user)
    else:
        data = request.json
        campos = []
        valores = []
        if data.get('correo'):
            campos.append('correo=%s')
            valores.append(data['correo'])
        if data.get('nombre_usuario'):
            campos.append('nombre_usuario=%s')
            valores.append(data['nombre_usuario'])
        if data.get('contraseña'):
            campos.append('contraseña=%s')
            valores.append(generate_password_hash(data['contraseña']))
        if data.get('pregunta'):
            campos.append('1era_pregunta=%s')
            valores.append(data['pregunta'])
        if data.get('respuesta'):
            campos.append('1era_respuesta=%s')
            valores.append(data['respuesta'])
        if not campos:
            return jsonify({'success': False, 'error': 'Nada que actualizar'})
        valores.append(id_usuario)
        cursor.execute(f"UPDATE usuarios SET {', '.join(campos)} WHERE id_usuario=%s", valores)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})

# --- PACIENTES ---
@app.route('/api/pacientes', methods=['GET'])
def api_pacientes():
    if 'rol' not in session:
        return jsonify([]), 401
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if session['rol'] == 'paciente':
        id_usuario = session.get('id_usuario')
        cursor.execute("SELECT * FROM paciente WHERE status='activo' AND id_usuario = %s", (id_usuario,))
    else:
        cursor.execute("SELECT * FROM paciente WHERE status='activo'")
    pacientes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(pacientes)

@app.route('/api/paciente/<int:id_paciente>', methods=['GET'])
def api_paciente_get(id_paciente):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM paciente WHERE id_paciente = %s", (id_paciente,))
    paciente = cursor.fetchone()
    cursor.close()
    conn.close()
    if paciente:
        return jsonify(paciente)
    else:
        return jsonify({'error': 'Paciente no encontrado'}), 404

@app.route('/api/paciente', methods=['POST'])
def api_paciente_create():
    data = request.json
    # Toma el id_usuario de la sesión si existe
    id_usuario = session.get('id_usuario') or data.get('id_usuario')
    campos = [
        'id_usuario', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido',
        'cedula', 'fecha_de_nacimiento', 'lugar_nacimiento', 'instruccion', 'ocupacion',
        'estado_civil', 'religion', 'nombre_conyuge', 'telefono_conyuge', 'hijos',
        'centro_estudio_y/o_trabajo', 'grado', 'tiempo_residencia', 'sexo', 'telefono',
        'correo', 'direccion', 'id_estado', 'id_municipio', 'id_parroquia', 'status'
    ]
    valores = [
        id_usuario,
        data.get('primer_nombre', ''),
        data.get('segundo_nombre', ''),
        data.get('primer_apellido', ''),
        data.get('segundo_apellido', ''),
        data.get('cedula', ''),
        data.get('fecha_de_nacimiento', ''),
        data.get('lugar_nacimiento', ''),
        data.get('instruccion', ''),
        data.get('ocupacion', ''),
        data.get('estado_civil', ''),
        data.get('religion', ''),
        data.get('nombre_conyuge', ''),
        data.get('telefono_conyuge', ''),
        data.get('hijos', ''),
        data.get('centro_estudio_y/o_trabajo', ''),
        data.get('grado', ''),
        data.get('tiempo_residencia', ''),
        data.get('sexo', ''),
        data.get('telefono', ''),
        data.get('correo', ''),
        data.get('direccion', ''),
        data.get('id_estado', ''),
        data.get('id_municipio', ''),
        data.get('id_parroquia', ''),
        'activo'
    ]
    placeholders = ','.join(['%s'] * len(campos))
    campos_sql = ','.join(f'`{c}`' for c in campos)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO paciente ({campos_sql}) VALUES ({placeholders})", valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/paciente/<int:id_paciente>', methods=['POST'])
def api_paciente_update(id_paciente):
    data = request.json
    campos_db = [
        'id_usuario', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido',
        'cedula', 'fecha_de_nacimiento', 'lugar_nacimiento', 'instruccion', 'ocupacion',
        'estado_civil', 'religion', 'nombre_conyuge', 'telefono_conyuge', 'hijos',
        'centro_estudio_y/o_trabajo', 'grado', 'tiempo_residencia', 'sexo', 'telefono',
        'correo', 'direccion', 'id_estado', 'id_municipio', 'id_parroquia', 'status'
    ]
    campos = []
    valores = []
    for campo in campos_db:
        if campo in data:
            campos.append(f"`{campo}` = %s")
            valores.append(data[campo])
    if not campos:
        return jsonify({'error': 'Nada que actualizar'}), 400
    valores.append(id_paciente)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"UPDATE paciente SET {', '.join(campos)} WHERE id_paciente = %s", valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

# --- HISTORIAL CLÍNICO ---
@app.route('/api/historial/<int:id_paciente>', methods=['GET'])
def api_historial_get(id_paciente):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM historial_medico WHERE id_paciente = %s", (id_paciente,))
    historial = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(historial)

@app.route('/api/historial/<int:id_paciente>', methods=['POST'])
def api_historial_update(id_paciente):
    data = request.json
    campos = []
    valores = []
    for campo in ['fecha_consulta', 'diagnostico', 'tratamiento', 'antecedentes', 'status']:
        if campo in data:
            campos.append(f"{campo} = %s")
            valores.append(data[campo])
    if not campos:
        return jsonify({'error': 'Nada que actualizar'}), 400
    valores.append(id_paciente)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"UPDATE historial_medico SET {', '.join(campos)} WHERE id_paciente = %s", valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/historial', methods=['POST'])
def api_historial_create():
    data = request.json
    campos = ['id_paciente', 'fecha_consulta', 'diagnostico', 'tratamiento', 'antecedentes', 'status']
    valores = [data.get(campo, '') for campo in campos]
    placeholders = ','.join(['%s'] * len(campos))
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"INSERT INTO historial_medico ({','.join(campos)}) VALUES ({placeholders})", valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/cita', methods=['POST'])
def api_cita_create():
    data = request.json
    if not data.get('id_paciente'):
        return jsonify({'success': False, 'error': 'Debe seleccionar un paciente'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    modalidad = data.get('modalidad')
    fecha = data.get('fecha_cita')
    hora = data.get('hora_cita')

    # Normaliza la hora a formato 24h (ej: "09:00 AM" -> "09:00")
    import re
    match = re.match(r'(\d+):(\d+)', str(hora))
    if match:
        h, m, suf = int(match.group(1)), int(match.group(2)), match.group(3)
        if suf == 'PM' and h != 12:
            h += 12
        if suf == 'AM' and h == 12:
            h = 0
        hora = f"{h:02d}:{m:02d}"

    id_psicologa = 1

    import datetime
    dia_semana = datetime.datetime.strptime(fecha, "%Y-%m-%d").weekday()
    dias_map = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    dia_nombre = dias_map[dia_semana]

    cursor.execute("""
        SELECT id_horario, dias_laborables, horario_laboral FROM horario
        WHERE id_psicologa = %s AND status = 'Activo'
    """, (id_psicologa,))
    horarios = cursor.fetchall()
    id_horario = None
    for h in horarios:
        if not h['dias_laborables'] or not h['horario_laboral']:
            continue
        dias = [d.strip().lower() for d in h['dias_laborables'].split(',')]
        horas = [hh.strip() for hh in h['horario_laboral'].split(',')]
        if dia_nombre in dias and hora in horas:
            id_horario = h['id_horario']
            break

    if not id_horario:
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'error': 'No hay horario disponible para esa fecha/hora'}), 400

    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO cita (
            id_paciente, id_psicologa, id_horario, modalidad, servicio, fecha_cita, hora_cita, metodo_pago, Status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data.get('id_paciente'),
        id_psicologa,
        id_horario,
        data.get('modalidad'),
        data.get('servicio'),  # <--- debe llamarse servicio
        data.get('fecha_cita'),
        hora.get('hora_cita'),  # Asegura que hora_cita tenga un valor por defecto
        data.get('metodo_pago'),
        data.get('Confirmada'),
    ))
    id_cita = cursor.lastrowid

    # 2. Guardar los datos clínicos en historia_clinica_psicologia
    cursor.execute("""
        INSERT INTO historia_clinica_psicologia (
            id_paciente, fecha_consulta, motivo_consulta, sintomas, tiempo_problema, desencadenantes,
            tratamientos_previos, auto_descripcion
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data.get('id_paciente'),
        data.get('fecha_cita'),
        data.get('motivo_consulta'),
        data.get('sintoma'),
        data.get('tiempo_problema'),
        data.get('factores_desencadenantes'),
        ', '.join([f"{t.get('fecha','')}: {t.get('tipo','')}" for t in data.get('tratamientos', [])]),
        data.get('auto_descripcion')
    ))

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/citas', methods=['GET'])
def api_citas():
    if 'rol' not in session:
        return jsonify({'error': 'No autenticado'}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    # Si el usuario es paciente, solo muestra sus citas
    if session['rol'] == 'paciente':
        id_paciente = session.get('id_paciente')
        cursor.execute("""
            SELECT c.fecha_cita, c.hora_cita, c.servicio, c.modalidad, c.metodo_pago, c.Status,
                   p.primer_nombre, p.primer_apellido
            FROM cita c
            JOIN paciente p ON c.id_paciente = p.id_paciente
            WHERE c.id_paciente = %s
            ORDER BY c.fecha_cita DESC, c.hora_cita DESC
        """, (id_paciente,))
    else:
        # Si es psicóloga, muestra todas las citas
        cursor.execute("""
            SELECT c.fecha_cita, c.hora_cita, c.servicio, c.modalidad, c.metodo_pago, c.Status,
                   p.primer_nombre, p.primer_apellido
            FROM cita c
            JOIN paciente p ON c.id_paciente = p.id_paciente
            ORDER BY c.fecha_cita DESC, c.hora_cita DESC
        """)
    citas = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convertir hora_cita a string para evitar problemas de serialización
    for cita in citas:
        if 'hora_cita' in cita and cita['hora_cita'] is not None:
            cita['hora_cita'] = str(cita['hora_cita'])

    return jsonify(citas)

@app.route('/api/horarios', methods=['GET'])
def api_horarios():
    modalidad = request.args.get('modalidad')
    fecha = request.args.get('fecha')
    if not modalidad or not fecha:
        return jsonify([])

    # Mapear modalidad a ids de horario
    if modalidad == 'presencial':
        ids_horario = (11, 12)
    elif modalidad == 'online':
        ids_horario = (13, 14)
    else:
        return jsonify([])

    # Obtener el día de la semana
    import datetime
    dias_map = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    dia_semana = datetime.datetime.strptime(fecha, "%Y-%m-%d").weekday()
    dia_nombre = dias_map[dia_semana]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    horarios_disponibles = set()
    for id_horario in ids_horario:
        cursor.execute("SELECT dias_laborables, horario_laboral FROM horario WHERE id_horario = %s AND status = 'Activo'", (id_horario,))
        h = cursor.fetchone()
        if not h:
            continue
        dias = [d.strip().lower() for d in h['dias_laborables'].split(',')]
        horas = [hh.strip() for hh in h['horario_laboral'].split(',')]
        if dia_nombre in dias:
            horarios_disponibles.update(horas)
    cursor.close()
    conn.close()
    # Devuelve lista ordenada
    return jsonify(sorted(list(horarios_disponibles)))

@app.route('/api/estados')
def api_estados():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_estado, estado FROM estados ORDER BY estado")
    estados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(estados)

@app.route('/api/municipios/<int:id_estado>')
def api_municipios(id_estado):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_municipio, municipio FROM municipios WHERE id_estado = %s ORDER BY municipio", (id_estado,))
    municipios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(municipios)

@app.route('/api/parroquias/<int:id_municipio>')
def api_parroquias(id_municipio):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_parroquia, parroquia FROM parroquias WHERE id_municipio = %s ORDER BY parroquia", (id_municipio,))
    parroquias = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(parroquias)

@app.route('/registro-completo', methods=['POST'])
def registro_completo():
    data = request.get_json()
    try:
        # 1. Crear usuario
        hashed_password = generate_password_hash(data.get('password'))
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO usuarios (
                correo, nombre_usuario, Primer_Nombre, Primer_Apellido, contraseña, 
                1era_pregunta, 1era_respuesta, 2da_pregunta, 2da_respuesta, tipo_usuario, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'paciente', 'activo')
        """, (
            data.get('email'),
            data.get('username'),
            data.get('name'),
            data.get('name-1'),
            hashed_password,
            'Color Favorito',
            data.get('color-favorito'),
            'Animal Favorito',
            data.get('animal-favorito')
        ))
        conn.commit()
        id_usuario = cursor.lastrowid

        # 2. Crear paciente
        cursor.execute("""
            INSERT INTO paciente (
                id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                cedula, fecha_de_nacimiento, lugar_nacimiento, instruccion, ocupacion,
                estado_civil, religion, nombre_conyuge, telefono_conyuge, hijos,
                `centro_estudio_y/o_trabajo`, grado, tiempo_residencia, sexo, telefono,
                correo, direccion, id_estado, id_municipio, id_parroquia, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'activo')
        """, (
            id_usuario,
            data.get('name', ''),
            data.get('name-3', ''),
            data.get('name-1', ''),
            data.get('name-2', ''),
            data.get('name-4', ''),
            data.get('date', ''),
            data.get('lugar_nacimiento', ''),
            data.get('instruccion', ''),
            data.get('ocupacion', ''),
            data.get('estado_civil', ''),
            data.get('religion', ''),
            data.get('nombre_conyuge', ''),
            data.get('telefono_conyuge', ''),
            data.get('hijos', ''),
            data.get('centro_estudio_y/o_trabajo', ''),
            data.get('grado', ''),
            data.get('tiempo_residencia', ''),
            data.get('sexo', ''),
            data.get('phone', ''),
            data.get('correo', ''),
            data.get('direccion', ''),
            data.get('estado', ''),
            data.get('municipio', ''),
            data.get('parroquia', '')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Punto de entrada de la aplicación
if __name__ == '__main__':
    app.run(debug=True)