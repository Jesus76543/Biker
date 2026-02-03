const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
app.use(express.json());
app.use(cors());

// --- CONEXIÓN ---
mongoose.connect('mongodb+srv://jesus3041230346_db_user:<db_password>@cluster0.hd7hsom.mongodb.net/?appName=Cluster0')
    .then(() => console.log('✅ Order-Service (3003): Conectado a MongoDB'))
    .catch(err => console.error('❌ Error Mongo:', err));

const OrderSchema = new mongoose.Schema({
    customer: {
        name: String,
        email: String,
        address: String,
        paymentMethod: { type: String, default: 'Credit Card' }
    },
    items: [{
        productId: String,
        name: String,
        basePrice: Number,
        selectedOptions: Object 
    }],
    total: Number,
    status: { type: String, default: 'paid' }, 
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// --- RUTAS ---

// 1. CREAR ORDEN (Apunta al puerto 3005 que es el que tienes activo)
app.post('/orders', async (req, res) => {
    try {
        const { customer, items, total } = req.body;
        
        const newOrder = await Order.create({ customer, items, total, status: 'paid' });
        console.log(`💰 Orden Guardada ID: ${newOrder._id}`);

        // CORRECCIÓN AQUÍ: Puerto 3005
        axios.post('http://localhost:3005/send-confirmation', {
            email: customer.email,
            orderId: newOrder._id.toString(),
            total: total,
            items: items
        })
        .then(() => console.log("📣 Notificación enviada al puerto 3005"))
        .catch(err => console.error("⚠️ Error avisando a notificaciones (3005):", err.message));

        res.status(201).json(newOrder);

    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// 2. LEER TODAS (Para Admin)
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. LEER UNA ORDEN POR ID (¡IMPORTANTE PARA EL TRACKING!)
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Orden no encontrada" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Error buscando la orden" });
    }
});

// 4. ACTUALIZAR ESTADO
app.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3003, () => {
    console.log(`📦 Order Service corriendo en http://localhost:3003`);
});