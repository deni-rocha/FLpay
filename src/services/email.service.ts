import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env' });


const { EMAIL, EMAIL_PASS } = process.env;



// Crie o transporter com as configurações do seu servidor SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // ou outro servidor SMTP
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  }
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${process.env.BASE_URL}/user/verify?token=${token}`;

    
    try {
      await transporter.sendMail({
      from: '"Ralce Store" frevolink@email.com',
      to,
      subject: 'Confirmação de E-mail - Realce Store',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Bem-vindo ao Realce Store',!</h2>
          <p>Obrigado por se registrar. Para começar, por favor confirme seu e-mail clicando no link abaixo:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
          </p>
          <p>Se você não se registrou no Realce Store',, ignore este e-mail.</p>
          <p>Atenciosamente,<br/>Equipe Realce Store',</p>
        </div>
      `
    });
      
        console.log('E-mail enviado via SendGrid!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
        
    }
};