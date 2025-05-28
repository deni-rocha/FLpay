import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${process.env.BASE_URL}/user/verify?token=${token}`;

    const msg = {
        to,
        from: 'frevolink@gmail.com', // Deve ser verificado no SendGrid
        subject: 'Confirmação de E-mail - FLpay',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Bem-vindo ao FLpay!</h2>
        <p>Obrigado por se registrar. Para começar, por favor confirme seu e-mail clicando no link abaixo:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
        </p>
        <p>Se você não se registrou no FLpay, ignore este e-mail.</p>
        <p>Atenciosamente,<br/>Equipe FLpay</p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        console.log('E-mail enviado via SendGrid!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
        
    }
};