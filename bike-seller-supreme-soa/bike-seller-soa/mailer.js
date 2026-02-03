const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jesusramiroriverabracho8@gmail.com',
    pass: 'jlnz weer pvhr gnws' // NO tu contraseña normal, busca "App Passwords" en Google
  }
});

const sendOrderEmail = async (email, orderId) => {
  const mailOptions = {
    from: 'BikeSeller Supreme <ventas@bikeseller.com>',
    to: email,
    subject: `🚴‍♂️ ¡Pedido Confirmado! #${orderId}`,
    html: `
      <div style="background: #111; color: white; padding: 20px; font-family: sans-serif;">
        <h1 style="color: #22c55e;">¡Gracias por tu compra!</h1>
        <p>Tu BMX está siendo preparada.</p>
        <p>ID de Rastreo: <strong>INT-MX-${orderId}</strong></p>
        <a href="http://localhost:5173/tracking" style="color: #3b82f6;">Rastrear Pedido</a>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderEmail };