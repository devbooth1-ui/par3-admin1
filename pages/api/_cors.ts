import Cors from 'cors';

// Helper to wait for a middleware to execute before continuing
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
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
