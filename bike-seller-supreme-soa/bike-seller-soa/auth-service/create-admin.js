const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuración
const MONGO_URI = 'mongodb://localhost:27017/bike_catalog_db';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🔌 Conectado a MongoDB...");

        // Definimos el esquema temporalmente para este script
        const UserSchema = new mongoose.Schema({
            username: String,
            email: String,
            password: String,
            role: String,
            authProvider: String
        });
        const User = mongoose.model('User', UserSchema);

        // 1. Revisar si ya existe
        const email = "admin@bikeseller.com";
        const exists = await User.findOne({ email });

        if (exists) {
            console.log("⚠️ El admin ya existe. No es necesario crearlo.");
            process.exit();
        }

        // 2. Crear el Admin
        const hashedPassword = await bcrypt.hash("admin123", 10); // <--- TU CONTRASEÑA AQUÍ

        await User.create({
            username: "Super Admin",
            email: email,
            password: hashedPassword,
            role: "admin", // <--- EL PODER REAL
            authProvider: "local"
        });

        console.log("✅ ¡ADMINISTRADOR CREADO CON ÉXITO!");
        console.log("📧 Correo: admin@bikeseller.com");
        console.log("🔑 Clave: admin123");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();