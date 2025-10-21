import express, { type Request, type Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  res.send('Person Management Backend : Rest API');
});

export default router;
