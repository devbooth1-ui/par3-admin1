import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const {
        to = 'devbooth1@yahoo.com',
        subject = 'You have a claim!',
        text = 'A new claim has been submitted. Please review.',
        html = `<strong>A new claim has been submitted. <a href="https://par3-challenge-app-tailwind.vercel.app/claims">Review it here.</a></strong>`
    } = req.body;

    const msg = { to, from: 'devbooth1@yahoo.com', subject, text, html };

    try {
        await sgMail.send(msg);
        res.status(200).json({ success: true, message: `Email sent to ${to}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
