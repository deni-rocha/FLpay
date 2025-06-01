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
  },
});

export const sendVerificationEmail = async (to: string, token: string, name: string) => {
  const verificationLink = `${process.env.BASE_URL}/user/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Ralce Store" frevolink@email.com',
      to,
      subject: 'Confirmação de E-mail - Realce Store',
      html: `
      <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifique seu e-mail - Realce Store</title>
  </head>
  <body style="margin:0;padding:0;background-color:inherit;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <!-- Cabeçalho -->
    <div style="background-color:#FFC300;color:white;padding:30px 20px;text-align:center;">
      <h1 style="margin:0;font-size:24px;color:black;">Bem-vindo à Realce Store!</h1>
    </div>

    <!-- Conteúdo -->
    <div style="padding:30px 20px;color:#333;">
      <p style="font-size:16px;line-height:1.5;">Olá, ${name}!</p>
      <p style="font-size:16px;line-height:1.5;">Obrigado por se cadastrar na <strong>Realce Store</strong>. Para garantir que este seja o seu e-mail, clique no botão abaixo para verificar sua conta:</p>
      
      <a href="${verificationLink}" style="display:inline-block;margin:20px 0;padding:12px 24px;background-color:#06d6a0;color:white;text-decoration:none;border-radius:4px;font-weight:bold;">Verificar E-mail</a>

      <p style="font-size:16px;line-height:1.5;">Se você não se cadastrou recentemente em nossa loja, ignore este e-mail.</p>
    </div>

    <!-- Rodapé -->
    <div style="background-color:#FFC300;text-align:center;font-size:12px;padding:20px;">
      &copy; 2025 Realce Store. Todos os direitos reservados.<br>
    </div>
    </div>
  </body>
  </html>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (to: string, token: string, name: string) => {
  const resetLink = `${process.env.BASE_URL}/user/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Ralce Store" frevolink@gmail.com',
      to,
      subject: 'Redefinição de Senha - Realce Store',
      html: `
      <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha - Realce Store</title>
  </head>
  <body style="margin:0;padding:0;background-color:inherit;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <!-- Cabeçalho -->
    <div style="background-color:#FFC300;color:white;padding:30px 20px;text-align:center;">
      <h1 style="margin:0;font-size:24px;color:black;">Redefinição de Senha - Realce Store</h1>
    </div>
    <!-- Conteúdo -->
    <div style="padding:30px 20px;color:#333;">
      <p style="font-size:16px;line-height:1.5;">Olá, ${name}!</p>
      <p style="font-size:16px;line-height:1.5;">Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, pode ignorar este e-mail.</p>
      <p style="font-size:16px;line-height:1.5;">Caso contrário, clique no botão abaixo para redefinir sua senha:</p>
      <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:12px 24px;background-color:#06d6a0;color:white;text-decoration:none;border-radius:4px;font-weight:bold;">Redefinir Senha</a>
      <p style="font-size:16px;line-height:1.5;">O link de redefinição de senha é válido por 24 horas.</p>
      <p style="font-size:16px;line-height:1.5;">Se você não solicitou a redefinição de senha, pode ignorar este e-mail.</p>
    </div>
    <!-- Rodapé -->
    <div style="background-color:#FFC300;text-align:center;font-size:12px;padding:20px;">
      &copy; 2025 Realce Store. Todos os direitos reservados.<br>
    </div>
    </div>
  </body>
  </html>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    throw error;
  }
};
