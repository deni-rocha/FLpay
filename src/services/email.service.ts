import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${process.env.BASE_URL}/verify?token=${token}`;

    const msg = {
        to,
        from: 'frevolink@gmail.com', // Deve ser verificado no SendGrid
        subject: 'Verifique seu e-mail',
        html: `
      <p>Clique no link abaixo para verificar seu e-mail:</p>
      <a href="${verificationLink}">${verificationLink}</a>
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