<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Configuración de la base de datos
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'emocionvital_db');

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Establecer charset
$conn->set_charset("utf8mb4");

// Obtener método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$table = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request));
$key = array_shift($request);

// Procesar la solicitud
switch ($method) {
    case 'GET':
        handleGet($conn, $table, $key);
        break;
    case 'POST':
        handlePost($conn, $table);
        break;
    case 'PUT':
        handlePut($conn, $table, $key);
        break;
    case 'DELETE':
        handleDelete($conn, $table, $key);
        break;
    case 'OPTIONS':
        http_response_code(200);
        break;
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conn->close();

// Funciones para manejar los diferentes métodos HTTP
function handleGet($conn, $table, $key) {
    // Obtener datos de una tabla específica
    if ($table && !$key) {
        $sql = "SELECT * FROM `$table`";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    } 
    // Obtener un registro específico por ID
    elseif ($table && $key) {
        $sql = "SELECT * FROM `$table` WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode($result->fetch_assoc());
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Registro no encontrado"));
        }
    } 
    // Endpoint para login
    elseif ($table == 'login') {
        $data = json_decode(file_get_contents('php://input'), true);
        $correo = $data['correo'];
        $contraseña = $data['contraseña'];
        
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($contraseña, $user['contraseña'])) {
                // Obtener datos completos según el tipo de usuario
                if ($user['tipo_usuario'] == 'paciente') {
                    $sql_paciente = "SELECT * FROM paciente WHERE id_usuario = ?";
                    $stmt_paciente = $conn->prepare($sql_paciente);
                    $stmt_paciente->bind_param("i", $user['id_usuario']);
                    $stmt_paciente->execute();
                    $result_paciente = $stmt_paciente->get_result();
                    $user_data = $result_paciente->fetch_assoc();
                } else {
                    $sql_psicologa = "SELECT * FROM psicologa WHERE id_usuario = ?";
                    $stmt_psicologa = $conn->prepare($sql_psicologa);
                    $stmt_psicologa->bind_param("i", $user['id_usuario']);
                    $stmt_psicologa->execute();
                    $result_psicologa = $stmt_psicologa->get_result();
                    $user_data = $result_psicologa->fetch_assoc();
                }
                
                $response = array(
                    "success" => true,
                    "user" => $user,
                    "user_data" => $user_data
                );
                echo json_encode($response);
            } else {
                http_response_code(401);
                echo json_encode(array("success" => false, "message" => "Contraseña incorrecta"));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("success" => false, "message" => "Usuario no encontrado"));
        }
    }
    // Endpoint para recuperación de contraseña
    elseif ($table == 'recover') {
        $data = json_decode(file_get_contents('php://input'), true);
        $correo = $data['correo'];
        
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Aquí deberías implementar el envío de correo con las preguntas de seguridad
            $response = array(
                "success" => true,
                "pregunta1" => $user['1era_pregunta'],
                "pregunta2" => $user['2da_pregunta']
            );
            echo json_encode($response);
        } else {
            http_response_code(404);
            echo json_encode(array("success" => false, "message" => "Usuario no encontrado"));
        }
    }
    // Endpoint para verificar respuestas de seguridad
    elseif ($table == 'verify_answers') {
        $data = json_decode(file_get_contents('php://input'), true);
        $correo = $data['correo'];
        $respuesta1 = $data['respuesta1'];
        $respuesta2 = $data['respuesta2'];
        
        $sql = "SELECT * FROM usuarios WHERE correo = ? AND 1era_respuesta = ? AND 2da_respuesta = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $correo, $respuesta1, $respuesta2);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(array("success" => true));
        } else {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Respuestas incorrectas"));
        }
    }
    // Endpoint para cambiar contraseña
    elseif ($table == 'change_password') {
        $data = json_decode(file_get_contents('php://input'), true);
        $correo = $data['correo'];
        $nueva_contraseña = password_hash($data['nueva_contraseña'], PASSWORD_DEFAULT);
        
        $sql = "UPDATE usuarios SET contraseña = ? WHERE correo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $nueva_contraseña, $correo);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Contraseña actualizada correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar la contraseña"));
        }
    }
    // Endpoint para obtener citas de un paciente
    elseif ($table == 'citas_paciente' && $key) {
        $sql = "SELECT c.*, p.primer_nombre, p.primer_apellido, ps.primer_nombre as nombre_psicologa, ps.primer_apellido as apellido_psicologa 
                FROM cita c
                JOIN paciente p ON c.id_paciente = p.id_paciente
                JOIN psicologa ps ON c.id_psicologa = ps.id_psicologa
                WHERE c.id_paciente = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener citas de una psicóloga
    elseif ($table == 'citas_psicologa' && $key) {
        $sql = "SELECT c.*, p.primer_nombre, p.primer_apellido 
                FROM cita c
                JOIN paciente p ON c.id_paciente = p.id_paciente
                WHERE c.id_psicologa = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener historial médico de un paciente
    elseif ($table == 'historial_paciente' && $key) {
        $sql = "SELECT * FROM historial_medico WHERE id_paciente = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener historias clínicas de un paciente
    elseif ($table == 'historias_clinicas' && $key) {
        $sql = "SELECT * FROM historia_clinica_psicologia WHERE id_paciente = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener informes médicos de un paciente
    elseif ($table == 'informes_paciente' && $key) {
        $sql = "SELECT i.*, p.primer_nombre as nombre_psicologa, p.primer_apellido as apellido_psicologa 
                FROM informe_medico i
                JOIN psicologa p ON i.id_psicologa = p.id_psicologa
                WHERE i.id_paciente = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener horarios de una psicóloga
    elseif ($table == 'horarios_psicologa' && $key) {
        $sql = "SELECT * FROM horario WHERE id_psicologa = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(array());
        }
    }
    // Endpoint para obtener estados, municipios y parroquias
    elseif ($table == 'ubicaciones') {
        // Obtener todos los estados
        $sql_estados = "SELECT * FROM estados";
        $result_estados = $conn->query($sql_estados);
        $estados = array();
        while($row = $result_estados->fetch_assoc()) {
            $estados[] = $row;
        }
        
        // Obtener todos los municipios
        $sql_municipios = "SELECT * FROM municipios";
        $result_municipios = $conn->query($sql_municipios);
        $municipios = array();
        while($row = $result_municipios->fetch_assoc()) {
            $municipios[] = $row;
        }
        
        // Obtener todas las parroquias
        $sql_parroquias = "SELECT * FROM parroquias";
        $result_parroquias = $conn->query($sql_parroquias);
        $parroquias = array();
        while($row = $result_parroquias->fetch_assoc()) {
            $parroquias[] = $row;
        }
        
        // Obtener todas las ciudades
        $sql_ciudades = "SELECT * FROM ciudades";
        $result_ciudades = $conn->query($sql_ciudades);
        $ciudades = array();
        while($row = $result_ciudades->fetch_assoc()) {
            $ciudades[] = $row;
        }
        
        $response = array(
            "estados" => $estados,
            "municipios" => $municipios,
            "parroquias" => $parroquias,
            "ciudades" => $ciudades
        );
        
        echo json_encode($response);
    }
}

function handlePost($conn, $table) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Registro de usuario
    if ($table == 'register') {
        // Verificar si el correo ya existe
        $sql_check = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param("s", $data['correo']);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();
        
        if ($result_check->num_rows > 0) {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "El correo ya está registrado"));
            return;
        }
        
        // Hash de la contraseña
        $hashed_password = password_hash($data['contraseña'], PASSWORD_DEFAULT);
        
        // Insertar usuario
        $sql = "INSERT INTO usuarios (correo, nombre_usuario, contraseña, 1era_pregunta, 1era_respuesta, 2da_pregunta, 2da_respuesta, tipo_usuario, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssss", 
            $data['correo'], 
            $data['nombre_usuario'], 
            $hashed_password, 
            $data['1era_pregunta'], 
            $data['1era_respuesta'], 
            $data['2da_pregunta'], 
            $data['2da_respuesta'], 
            $data['tipo_usuario'], 
            $data['status']
        );
        
        if ($stmt->execute()) {
            $user_id = $stmt->insert_id;
            
            // Insertar datos específicos según el tipo de usuario
            if ($data['tipo_usuario'] == 'paciente') {
                $sql_paciente = "INSERT INTO paciente (id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, edad, fecha_de_nacimiento, sexo, telefono, direccion, id_estado, id_municipio, id_parroquia, status) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt_paciente = $conn->prepare($sql_paciente);
                $stmt_paciente->bind_param("isssssiisssiiis", 
                    $user_id,
                    $data['primer_nombre'],
                    $data['segundo_nombre'],
                    $data['primer_apellido'],
                    $data['segundo_apellido'],
                    $data['cedula'],
                    $data['edad'],
                    $data['fecha_de_nacimiento'],
                    $data['sexo'],
                    $data['telefono'],
                    $data['direccion'],
                    $data['id_estado'],
                    $data['id_municipio'],
                    $data['id_parroquia'],
                    $data['status']
                );
                
                if ($stmt_paciente->execute()) {
                    $response = array(
                        "success" => true,
                        "message" => "Paciente registrado correctamente",
                        "id_usuario" => $user_id,
                        "id_paciente" => $stmt_paciente->insert_id
                    );
                    echo json_encode($response);
                } else {
                    // Si falla la inserción del paciente, borramos el usuario creado
                    $sql_delete = "DELETE FROM usuarios WHERE id_usuario = ?";
                    $stmt_delete = $conn->prepare($sql_delete);
                    $stmt_delete->bind_param("i", $user_id);
                    $stmt_delete->execute();
                    
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Error al registrar el paciente"));
                }
            } else {
                $sql_psicologa = "INSERT INTO psicologa (id_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, direccion, especialidad, status) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt_psicologa = $conn->prepare($sql_psicologa);
                $stmt_psicologa->bind_param("issssssss", 
                    $user_id,
                    $data['primer_nombre'],
                    $data['segundo_nombre'],
                    $data['primer_apellido'],
                    $data['segundo_apellido'],
                    $data['telefono'],
                    $data['direccion'],
                    $data['especialidad'],
                    $data['status']
                );
                
                if ($stmt_psicologa->execute()) {
                    $response = array(
                        "success" => true,
                        "message" => "Psicóloga registrada correctamente",
                        "id_usuario" => $user_id,
                        "id_psicologa" => $stmt_psicologa->insert_id
                    );
                    echo json_encode($response);
                } else {
                    // Si falla la inserción de la psicóloga, borramos el usuario creado
                    $sql_delete = "DELETE FROM usuarios WHERE id_usuario = ?";
                    $stmt_delete = $conn->prepare($sql_delete);
                    $stmt_delete->bind_param("i", $user_id);
                    $stmt_delete->execute();
                    
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Error al registrar la psicóloga"));
                }
            }
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al registrar el usuario"));
        }
    }
    // Insertar en otras tablas
    else {
        $columns = array_keys($data);
        $values = array_values($data);
        $placeholders = array_fill(0, count($values), '?');
        
        $sql = "INSERT INTO `$table` (" . implode(',', $columns) . ") VALUES (" . implode(',', $placeholders) . ")";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($values as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            $response = array(
                "success" => true,
                "id" => $stmt->insert_id,
                "message" => "Registro creado correctamente"
            );
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al crear el registro"));
        }
    }
}

function handlePut($conn, $table, $key) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Actualizar usuario
    if ($table == 'usuarios' && $key) {
        // Si se está actualizando la contraseña, hacer hash
        if (isset($data['contraseña'])) {
            $data['contraseña'] = password_hash($data['contraseña'], PASSWORD_DEFAULT);
        }
        
        $columns = array();
        $values = array();
        foreach ($data as $column => $value) {
            $columns[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $key;
        
        $sql = "UPDATE `$table` SET " . implode(',', $columns) . " WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        $types .= 'i'; // para el ID
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Registro actualizado correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar el registro"));
        }
    }
    // Actualizar paciente
    elseif ($table == 'paciente' && $key) {
        $columns = array();
        $values = array();
        foreach ($data as $column => $value) {
            $columns[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $key;
        
        $sql = "UPDATE `$table` SET " . implode(',', $columns) . " WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        $types .= 'i'; // para el ID
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Paciente actualizado correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar el paciente"));
        }
    }
    // Actualizar psicóloga
    elseif ($table == 'psicologa' && $key) {
        $columns = array();
        $values = array();
        foreach ($data as $column => $value) {
            $columns[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $key;
        
        $sql = "UPDATE `$table` SET " . implode(',', $columns) . " WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        $types .= 'i'; // para el ID
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Psicóloga actualizada correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar la psicóloga"));
        }
    }
    // Actualizar cita
    elseif ($table == 'cita' && $key) {
        $columns = array();
        $values = array();
        foreach ($data as $column => $value) {
            $columns[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $key;
        
        $sql = "UPDATE `$table` SET " . implode(',', $columns) . " WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        $types .= 'i'; // para el ID
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Cita actualizada correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar la cita"));
        }
    }
    // Actualizar otras tablas
    elseif ($table && $key) {
        $columns = array();
        $values = array();
        foreach ($data as $column => $value) {
            $columns[] = "$column = ?";
            $values[] = $value;
        }
        $values[] = $key;
        
        $sql = "UPDATE `$table` SET " . implode(',', $columns) . " WHERE id_$table = ?";
        $stmt = $conn->prepare($sql);
        
        // Crear el tipo de parámetros para bind_param
        $types = '';
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_double($value)) $types .= 'd';
            else $types .= 's';
        }
        $types .= 'i'; // para el ID
        
        $stmt->bind_param($types, ...$values);
        
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Registro actualizado correctamente"));
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Error al actualizar el registro"));
        }
    }
}

function handleDelete($conn, $table, $key) {
    if ($table && $key) {
        // Eliminar paciente (y su usuario asociado)
        if ($table == 'paciente') {
            // Primero obtener el id_usuario asociado
            $sql_get_user = "SELECT id_usuario FROM paciente WHERE id_paciente = ?";
            $stmt_get_user = $conn->prepare($sql_get_user);
            $stmt_get_user->bind_param("i", $key);
            $stmt_get_user->execute();
            $result_get_user = $stmt_get_user->get_result();
            
            if ($result_get_user->num_rows > 0) {
                $row = $result_get_user->fetch_assoc();
                $id_usuario = $row['id_usuario'];
                
                // Eliminar el paciente
                $sql_delete_paciente = "DELETE FROM paciente WHERE id_paciente = ?";
                $stmt_delete_paciente = $conn->prepare($sql_delete_paciente);
                $stmt_delete_paciente->bind_param("i", $key);
                
                if ($stmt_delete_paciente->execute()) {
                    // Eliminar el usuario asociado
                    $sql_delete_user = "DELETE FROM usuarios WHERE id_usuario = ?";
                    $stmt_delete_user = $conn->prepare($sql_delete_user);
                    $stmt_delete_user->bind_param("i", $id_usuario);
                    
                    if ($stmt_delete_user->execute()) {
                        echo json_encode(array("success" => true, "message" => "Paciente y usuario asociado eliminados correctamente"));
                    } else {
                        http_response_code(500);
                        echo json_encode(array("success" => false, "message" => "Paciente eliminado pero error al eliminar el usuario asociado"));
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Error al eliminar el paciente"));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "Paciente no encontrado"));
            }
        }
        // Eliminar psicóloga (y su usuario asociado)
        elseif ($table == 'psicologa') {
            // Primero obtener el id_usuario asociado
            $sql_get_user = "SELECT id_usuario FROM psicologa WHERE id_psicologa = ?";
            $stmt_get_user = $conn->prepare($sql_get_user);
            $stmt_get_user->bind_param("i", $key);
            $stmt_get_user->execute();
            $result_get_user = $stmt_get_user->get_result();
            
            if ($result_get_user->num_rows > 0) {
                $row = $result_get_user->fetch_assoc();
                $id_usuario = $row['id_usuario'];
                
                // Eliminar la psicóloga
                $sql_delete_psicologa = "DELETE FROM psicologa WHERE id_psicologa = ?";
                $stmt_delete_psicologa = $conn->prepare($sql_delete_psicologa);
                $stmt_delete_psicologa->bind_param("i", $key);
                
                if ($stmt_delete_psicologa->execute()) {
                    // Eliminar el usuario asociado
                    $sql_delete_user = "DELETE FROM usuarios WHERE id_usuario = ?";
                    $stmt_delete_user = $conn->prepare($sql_delete_user);
                    $stmt_delete_user->bind_param("i", $id_usuario);
                    
                    if ($stmt_delete_user->execute()) {
                        echo json_encode(array("success" => true, "message" => "Psicóloga y usuario asociado eliminados correctamente"));
                    } else {
                        http_response_code(500);
                        echo json_encode(array("success" => false, "message" => "Psicóloga eliminada pero error al eliminar el usuario asociado"));
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Error al eliminar la psicóloga"));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "Psicóloga no encontrada"));
            }
        }
        // Eliminar otros registros
        else {
            $sql = "DELETE FROM `$table` WHERE id_$table = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $key);
            
            if ($stmt->execute()) {
                echo json_encode(array("success" => true, "message" => "Registro eliminado correctamente"));
            } else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Error al eliminar el registro"));
            }
        }
    }
}
?>