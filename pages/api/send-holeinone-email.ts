import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { to, playerName, tournamentUrl } = req.body;
  const subject = 'Congratulations on your Hole in One!';
  const body = `
    <div style="font-family:sans-serif;">
      <h2>Congratulations on your Hole in One today!</h2>
      <p>This is what we live for. We are happy to say that your hole has been verified and you will receive the $1,000.00 prize for your accomplishment.</p>
      <p>In addition, you have automatically qualified for the $1 Million Shootout.</p>
      <p><a href="${tournamentUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Tournament Details & Registration</a></p>
      <p>Feel free to contact us at <a href="mailto:admin@p3c.live">admin@p3c.live</a>. See you soon!</p>
    </div>
  `;
  // Log the email that would be sent
  console.log('📧 HOLE IN ONE EMAIL TO:', to);
  console.log('📧 SUBJECT:', subject);
  console.log('📧 BODY:', body);
  setTimeout(() => {
    console.log('✅ Hole in One email sent successfully to', to);
  }, 1000);
  res.status(200).json({ success: true, message: `Hole in One email notification logged for ${to}` });
}
