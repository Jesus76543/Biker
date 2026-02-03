const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURACIÓN DEL CORREO ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jesusramiroriverabracho8@gmail.com', // <--- ¡Asegúrate de poner tu Gmail aquí!
        pass: 'jlnz weer pvhr gnws'    // <--- Y tu contraseña de 16 letras
    }
});

// --- RUTAS ---

app.post('/send-confirmation', async (req, res) => {
    try {
        const { email, orderId, total, items } = req.body;

        console.log(`📧 Enviando correo a: ${email} (Orden: ${orderId})`);

        const mailOptions = {
            from: 'BikeSeller Supreme <no-reply@bikeseller.com>',
            to: email,
            subject: `🚴 ¡Tu Pedido #${orderId.slice(-6)} está confirmado!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                        <h1 style="color: #22c55e; margin: 0;">¡Gracias por tu Compra!</h1>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <p>Hola,</p>
                        <p>Tu pedido ha sido recibido y ya estamos ensamblando tu BMX.</p>
                        
                        <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>ID de Orden:</strong> ${orderId}</p>
                            <p><strong>Total Pagado:</strong> $${total}</p>
                            <ul>
                                ${items.map(item => `<li>${item.name} ($${item.basePrice})</li>`).join('')}
                            </ul>
                        </div>

                        <a href="http://localhost:5173/tracking?id=${orderId}" style="display: block; width: 100%; text-align: center; background: #3b82f6; color: white; padding: 15px 0; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Rastrear mi Pedido
                        </a>
                        
                        <p style="font-size: 0.8rem; color: #888; text-align: center; margin-top: 20px;">
                            Si el botón no funciona, copia este ID: <strong>${orderId}</strong>
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Correo enviado con éxito.");
        res.json({ success: true });

    } catch (error) {
        console.error("❌ Error enviando correo:", error);
        res.status(500).json({ error: "Falló el envío del correo" });
    }
});

// Usamos el puerto 3006 (el que dejamos limpio)
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`📨 Notification Service LISTO en http://localhost:${PORT}`);
});