const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Servidor HTTP + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir conexión desde cualquier frontend por ahora
        methods: ["GET", "POST"]
    }
});

// 1. Conexión a Mongo (Para guardar historial de chats)
mongoose.connect('mongodb+srv://jesus3041230346_db_user:<db_password>@cluster0.hd7hsom.mongodb.net/?appName=Cluster0')
    .then(() => console.log('Chat-Service: Conectado a Mongo'))
    .catch(err => console.error(err));

// Modelo de Mensaje
const MessageSchema = new mongoose.Schema({
    fromUser: String, // ID del usuario o "SOPORTE"
    toUser: String,   // ID del destinatario
    content: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 2. Lógica de Socket.io (Tiempo Real)
io.on('connection', (socket) => {
    console.log(`⚡ Cliente conectado: ${socket.id}`);

    // Unirse a una sala privada (usando el ID del usuario)
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`Usuario ${userId} se unió a su sala privada`);
    });

    // Enviar mensaje
    socket.on('send_message', async (data) => {
        // data = { from: 'user_123', to: 'vendedor_ABC', text: 'Hola...' }
        
        // A) Guardar en BD
        const newMsg = await Message.create({
            fromUser: data.from,
            toUser: data.to,
            content: data.text
        });

        // B) Emitir al destinatario en tiempo real
        io.to(data.to).emit('receive_message', newMsg);
        
        // C) (Opcional) Confirmar al remitente que se envió
        io.to(data.from).emit('message_sent', newMsg);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Ruta simple para ver historial (REST)
app.get('/history/:userId', async (req, res) => {
    const messages = await Message.find({
        $or: [{ fromUser: req.params.userId }, { toUser: req.params.userId }]
    }).sort({ timestamp: 1 });
    res.json(messages);
});

const PORT = 3004;
server.listen(PORT, () => {
    console.log(`💬 Chat Service corriendo en http://localhost:${PORT}`);
});