import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

// Helper to wait for a middleware to execute before continuing
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, result: any) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const cors = Cors({
  origin: '*', // Adjust as needed for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
