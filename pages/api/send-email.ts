import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: log incoming body
  console.log('Received claim:', req.body);

  const {
    claimType = "",
    playerName = "",
    playerEmail = "",
    playerPhone = "",
    outfitDescription = ""
  } = req.body || {};

  // Trim strings before validation
  if (
    !claimType.trim() ||
    !playerName.trim() ||
    !playerEmail.trim()
  ) {
    return res.status(400).json({
      error: 'Missing required fields: claimType, playerName, playerEmail'
    });
  }

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(playerEmail.trim())) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  const claim = {
    claimType: claimType.trim(),
    playerName: playerName.trim(),
    playerEmail: playerEmail.trim(),
    playerPhone: playerPhone.trim(),
    outfitDescription: outfitDescription.trim(),
    submittedAt: new Date().toISOString()
  };

  return res.status(200).json({
    ok: true,
    message: 'Birdie claim submitted successfully',
    claim
  });
}
