const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONEXIÓN A LA BASE DE DATOS ---
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://jesus3041230346_db_user:<db_password>@cluster0.hd7hsom.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Catalog-Service: Conectado a MongoDB'))
    .catch(err => console.error('❌ Error de conexión a Mongo:', err));

// --- SCHEMA DEL PRODUCTO (Soporte para 3D y Precios) ---
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    basePrice: { type: Number, required: true },
    category: { type: String, default: 'BMX' },
    stock: { type: Number, default: 0 },
    imageUrl: String,
    
    // Configuración para el Visor 3D
    customizationOptions: [{
        partName: String, // Ej: "Color del Cuadro", "Tipo de Llantas"
        options: [{
            name: String,       // Ej: "Rojo Neón", "Aero Disc"
            colorCode: String,  // Ej: "#ff0000"
            extraPrice: Number  // Ej: 150
        }]
    }]
});

const Product = mongoose.model('Product', ProductSchema);

// --- RUTAS DE LA API ---

// 1. Obtener todos los productos
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Crear un nuevo producto
app.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 3. Eliminar un producto (NUEVO: Para que funcione el Admin Dashboard)
app.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});

// 4. Actualizar stock (Placeholder para integración con pedidos)
app.post('/update-stock', async (req, res) => {
    // Aquí iría la lógica cuando se confirme un pago
    res.json({ success: true });
});

// --- INICIAR SERVIDOR ---
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`📦 Catalog Service corriendo en http://localhost:${PORT}`);
});