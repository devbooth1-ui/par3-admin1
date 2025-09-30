import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Extract fields from request body
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject || !text || !html) {
        return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    try {
        // Create a test account on Ethereal (no signup needed)
        const testAccount = await nodemailer.createTestAccount();

        // Create the transporter for Ethereal SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // Email options
        const mailOptions = {
            from: `"Test Sender" <${testAccount.user}>`,
            to,
            subject,
            text,
            html,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        // Respond with preview URL
        res.status(200).json({
            success: true,
            message: `Email sent to ${to}`,
            previewUrl: nodemailer.getTestMessageUrl(info), // Visit this URL to preview the email!
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
