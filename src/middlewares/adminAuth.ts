import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

// Extend Express Request to include tokenData
declare global {
  namespace Express {
    interface Request {
      tokenData?: JwtPayload & {
        data?: {
          id?: number;
          userType?: string;
          [key: string]: any;
        };
      };
    }
  }
}

/**
 * Middleware to authenticate admin using JWT
 */
export const adminAuthMiddlewere = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const tokenWithBearer = req.headers.authorization;

  if (!tokenWithBearer) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const token = tokenWithBearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!) as JwtPayload;
    // console.log(decoded);
    if (decoded?.userType === 'Admin') {
      req.tokenData = decoded;
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};
