const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library'); // <--- NUEVA LIBRERÍA

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'clave_secreta_super_segura'; 
const MONGO_URI = 'mongodb+srv://jesus3041230346_db_user:<db_password>@cluster0.hd7hsom.mongodb.net/?appName=Cluster0';
// Si tienes tu Client ID de Google real, ponlo aquí. Si no, funcionará con advertencias en desarrollo.
const GOOGLE_CLIENT_ID = "359488177080-mutcirrnd5aaovhcrg4en7etgei2hkk4.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Auth-Service (3001): Conectado a Mongo'))
    .catch(err => console.error('❌ Error Mongo:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Opcional porque Google no usa password
    role: { type: String, default: 'client' },
    authProvider: { type: String, default: 'local' } // 'local' o 'google'
});

const User = mongoose.model('User', UserSchema);

// --- RUTAS ---

// 1. REGISTRO LOCAL (Formulario)
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Verificar si ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "El correo ya está registrado" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear usuario por defecto como 'client'
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'client',
            authProvider: 'local'
        });

        res.status(201).json({ message: "Usuario registrado. Ahora inicia sesión." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

// 2. LOGIN LOCAL
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
        if (user.authProvider === 'google') return res.status(400).json({ error: "Este correo usa Google para iniciar sesión" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token, role: user.role, username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. LOGIN/REGISTRO CON GOOGLE (Híbrido)
app.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;

        // Validamos el token con Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload(); // Aquí vienen los datos reales de Google
        const { email, name, sub } = payload;

        // Buscamos si el usuario ya existe
        let user = await User.findOne({ email });

        if (!user) {
            // SI NO EXISTE -> LO REGISTRAMOS AUTOMÁTICAMENTE
            user = await User.create({
                username: name,
                email: email,
                password: await bcrypt.hash(sub + SECRET_KEY, 10), // Password dummy seguro
                role: 'client',
                authProvider: 'google'
            });
            console.log("✨ Nuevo usuario creado vía Google:", email);
        }

        // Generamos nuestro propio JWT
        const appToken = jwt.sign({ id: user._id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        
        res.json({ token: appToken, role: user.role, username: user.username });

    } catch (error) {
        console.error("Error Google Auth:", error);
        res.status(400).json({ error: "Fallo la autenticación con Google" });
    }
});

app.listen(3001, () => {
    console.log(`🔐 Auth Service corriendo en http://localhost:3001`);
});