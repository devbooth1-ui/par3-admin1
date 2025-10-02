import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Received claim:', req.body);

  const {
    claimType = "",
    playerName = "",
    playerEmail = "",
    playerPhone = "",
    outfitDescription = "",
    teeDate = "",
    teeTime = "",
    courseName = ""
  } = req.body || {};

  if (
    !claimType.trim() ||
    !playerName.trim() ||
    !playerEmail.trim() ||
    !teeDate.trim() ||
    !teeTime.trim()
  ) {
    return res.status(400).json({
      error: 'Missing required fields: claimType, playerName, playerEmail, teeDate, teeTime'
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
    teeDate: teeDate.trim(),
    teeTime: teeTime.trim(),
    courseName: courseName.trim(),
    submittedAt: new Date().toISOString()
  };

  return res.status(200).json({
    ok: true,
    message: 'Claim submitted successfully',
    claim
  });
}
