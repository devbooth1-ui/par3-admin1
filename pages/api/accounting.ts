import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

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

// ===== JWT Secret =====
const JWT_SECRET = 'your-very-secure-secret';

// ===== Auth Middleware =====
interface AuthRequest extends Request {
  user?: { username: string };
}
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as { username: string };
    next();
  });
}

// ===== Login Route =====
app.post('/api/accounting/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username !== adminUser.username) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, adminUser.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Create JWT
  const token = jwt.sign({ username: adminUser.username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// ===== Change Password Route =====
app.post('/api/accounting/change-password', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const valid = await bcrypt.compare(oldPassword, adminUser.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Old password incorrect' });

  adminUser.passwordHash = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully.' });
});

// ===== Get Accounting Summary =====
app.get('/api/accounting/summary', authenticateToken, (req: AuthRequest, res: Response) => {
  const completed = transactions.filter(t => t.status === 'completed');
  const totalRevenue = completed.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const marketingRevenue = completed.filter(t => t.category === 'marketing').reduce((sum, t) => sum + t.amount, 0);

  // Revenue per course
  let revenueByCourse: Record<string, number> = {};
  completed.forEach(t => {
    if (t.type === 'income' && t.course) {
      revenueByCourse[t.course] = (revenueByCourse[t.course] || 0) + t.amount;
    }
  });

  // Expenses
  const totalExpenses = completed.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  res.json({
    totalRevenue,
    revenueByCourse,
    marketingRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    transactions: completed
  });
});

// ===== Add Transaction =====
app.post('/api/accounting/transaction', authenticateToken, (req: AuthRequest, res: Response) => {
  const { date, customer, description, amount, status, type, category, course } = req.body;
  const id = transactions.length + 1;
  transactions.push({ id, date, customer, description, amount, status, type, category, course });
  res.json({ message: 'Transaction added', id });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3033;
app.listen(PORT, () => {
  console.log(`Accounting backend running on http://localhost:${PORT}`);
});
