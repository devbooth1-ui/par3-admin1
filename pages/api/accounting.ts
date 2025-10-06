import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cors, runMiddleware } from './_cors';

// ===== User Store (replace with DB in production) =====
type User = {
  username: string;
  passwordHash: string;
};
let adminUser: User = {
  username: 'devbooth',
  passwordHash: bcrypt.hashSync('Jackson0908!', 10)
};

// ===== Transactions Store (replace with DB in production) =====
type Transaction = {
  id: number;
  date: string;
  customer: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'income' | 'expense';
  category: 'daily-play' | 'shootout-tournament' | 'course' | 'marketing';
  course: string;
};
let transactions: Transaction[] = [
  { id: 1, date: '2024-03-14', customer: 'John Smith', description: 'Par 3 Challenge Booking', amount: 25.0, status: 'completed', type: 'income', category: 'daily-play', course: 'Sunset Valley' },
  { id: 2, date: '2024-03-13', customer: 'Sarah Johnson', description: 'Tournament Entry Fee', amount: 50.0, status: 'completed', type: 'income', category: 'shootout-tournament', course: 'Sunset Valley' },
  { id: 3, date: '2024-03-12', customer: 'Course Maintenance', description: 'Equipment Repair', amount: 150.0, status: 'completed', type: 'expense', category: 'course', course: 'Meadow Brook' },
  { id: 4, date: '2024-03-11', customer: 'Mike Davis', description: 'Private Lesson', amount: 75.0, status: 'pending', type: 'income', category: 'daily-play', course: 'Meadow Brook' },
  { id: 5, date: '2024-03-10', customer: 'Lisa Wilson', description: 'Group Booking (4 players)', amount: 100.0, status: 'completed', type: 'income', category: 'daily-play', course: 'Sunset Valley' },
  { id: 6, date: '2024-03-09', customer: 'Golf Digest', description: 'Marketing Sponsorship', amount: 500.0, status: 'completed', type: 'income', category: 'marketing', course: '' },
];

const JWT_SECRET = 'your-very-secure-secret';

function verifyToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization || req.headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string') return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    jwt.verify(token, JWT_SECRET);
    return token;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  // Login
  if (req.method === 'POST' && req.url?.includes('login')) {
    const { username, password } = req.body;
    if (username !== adminUser.username) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, adminUser.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ username: adminUser.username }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }

  // Change Password
  if (req.method === 'POST' && req.url?.includes('change-password')) {
    const token = verifyToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const { oldPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(oldPassword, adminUser.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Old password incorrect' });
    adminUser.passwordHash = await bcrypt.hash(newPassword, 10);
    return res.json({ message: 'Password changed successfully' });
  }

  // Get Transactions
  if (req.method === 'GET' && req.url?.includes('transactions')) {
    const token = verifyToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    return res.json(transactions);
  }

  // Add Transaction
  if (req.method === 'POST' && req.url?.includes('transactions')) {
    const token = verifyToken(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const { date, customer, description, amount, status, type, category, course } = req.body;
    const id = transactions.length + 1;
    const transaction: Transaction = { id, date, customer, description, amount, status, type, category, course };
    transactions.push(transaction);
    return res.json(transaction);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
