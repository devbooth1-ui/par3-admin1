import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { to, subject, text, html } = req.body;

    if (!to || !subject || !text || !html) {
        return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    // Create a test account on Ethereal for every email (no signup required)
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using Ethereal's SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const mailOptions = {
        from: `"Test Sender" <${testAccount.user}>`,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: `Email sent to ${to}`,
            previewUrl: nodemailer.getTestMessageUrl(info), // Visit this URL to see the email!
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
