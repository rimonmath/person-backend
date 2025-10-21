import express, { NextFunction, type Request, type Response } from 'express';
import { User } from '../../../db/models/User.js';
const router = express.Router();

router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, 'full_name email user_type');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
