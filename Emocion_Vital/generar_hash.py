from werkzeug.security import generate_password_hash

user = "juanp"
password = "123456"

# Generar el hash (PBKDF2-HMAC-SHA256 con salt)
hashed_password = generate_password_hash(password)

print(f"Usuario: {user}")
print(f"Contraseña en texto plano: {password}")
print(f"Hash generado: {hashed_password}")