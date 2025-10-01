import type { NextApiRequest, NextApiResponse } from 'next';

// If you want to send email, import nodemailer or your provider here
// import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    claimType,
    playerName,
    playerEmail,
    playerPhone,
    outfitDescription
    // ...add any other fields you expect
  } = req.body || {};

  // Validate required fields
  if (!claimType || !playerName || !playerEmail) {
    return res.status(400).json({
      error: 'Missing required fields: claimType, playerName, playerEmail'
    });
  }

  // Optional: Validate email format
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(playerEmail)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Prepare claim object
  const claim = {
    claimType,
    playerName,
    playerEmail,
    playerPhone: playerPhone || '',
    outfitDescription: outfitDescription || '',
    submittedAt: new Date().toISOString()
    // ...add other info as needed
  };

  // TODO: Send the email here using nodemailer or another email provider
  // await sendEmailFunction({ ...claim });

  // Simulate success response
  return res.status(200).json({
    ok: true,
    message: 'Birdie claim submitted successfully',
    claim
  });
}
