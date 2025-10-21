import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

interface MongoDuplicateKeyError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
  name: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error handling:', err); // optional: log full error

  // Handle MongoDB duplicate key error
  const mongoErr = err as MongoDuplicateKeyError;
  if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
    const key = Object.keys(mongoErr.keyValue || {})[0];
    const value = mongoErr.keyValue ? mongoErr.keyValue[key] : '';
    return res.status(400).json({
      message: `Duplicate value for "${key}": "${value}". Please use a different one.`
    });
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: errors[0]
    });
  }

  // Fallback for other errors
  res.status(500).json({ message: 'Internal Server Error' });
};
