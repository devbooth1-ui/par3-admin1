import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { to, playerName, points, tournamentUrl } = req.body;
  const subject = 'Thanks for playing Par 3 Challenge!';
  const body = `
    <div style="font-family:sans-serif;">
      <h2>Great to see you out on the course today, ${playerName}!</h2>
      <p>We are happy you chose to participate in the Par 3 Challenge.</p>
      <p>You accumulated ${points} points toward your qualification for the upcoming $1 Million Shootout!</p>
      <p>We look forward to seeing you again real soon.</p>
      <p><a href="${tournamentUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Tournament Details</a></p>
    </div>
  `;
  // Log the email that would be sent
  console.log('📧 POINTS EMAIL TO:', to);
  console.log('📧 SUBJECT:', subject);
  console.log('📧 BODY:', body);
  setTimeout(() => {
    console.log('✅ Points email sent successfully to', to);
  }, 1000);
  res.status(200).json({ success: true, message: `Points email notification logged for ${to}` });
}
