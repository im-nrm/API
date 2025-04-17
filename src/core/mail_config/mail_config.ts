import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu", // Servidor SMTP de Zoho
    port: 587, // 465 para SSL, 587 para TLS
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER, // Email desde el cual se envía
      pass: process.env.EMAIL_PASS, // Contraseña o app password
    },
  });
  
  export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
    try {
      const info = await transporter.sendMail({
        from: `"Otakuhub" <${process.env.EMAIL_USER}>`, // Remitente
        to, // Destinatario
        subject, // Asunto
        text, // Cuerpo del correo en texto plano
        html, // Cuerpo en HTML (opcional)
      });
  
      console.log("Correo enviado: ", info.messageId);
      return info;
    } catch (error) {
      console.error("Error enviando correo: ", error);
      throw error;
    }
  };