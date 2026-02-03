const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que tu React local se conecte sin problemas

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 ESB Gateway: El tráfico fluye correctamente');
});

// === RUTAS DEL PROXY ===

// 1. Redirigir todo lo de /auth hacia el Auth Service (Puerto 3001)
app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:3001', // Hacia dónde va
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '', // Quita el prefijo '/auth' para que el servicio reciba solo '/login'
    },
}));

// (Aquí pondremos luego /catalog y /orders)
app.use('/catalog', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/catalog': '', 
    },
}));

app.use('/orders', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/orders': '', 
    },
}));

app.use('/chat', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    ws: true, // <--- ¡ESTO ES CLAVE! Habilita WebSockets
    pathRewrite: {
        '^/chat': '', 
    },
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🌐 ESB Gateway corriendo en http://localhost:${PORT}`);
});