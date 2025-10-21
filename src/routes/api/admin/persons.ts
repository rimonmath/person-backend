import express, { NextFunction, type Request, type Response } from 'express';
import { ReqWithValidated, zValidator } from '../../../middlewares/zValidator.js';
import { object as zObject, string as zString, email as zEmail, enum as zEnum } from 'zod';
import { Person } from '../../../db/models/Person.js';
const router = express.Router();

const addPersonSchema = zObject({
  first_name: zString().min(1, 'First name is required'),
  last_name: zString().min(1, 'Last name is required'),
  email: zEmail('Invalid email address'),
  gender: zEnum(['Male', 'Female', 'Other']),
  address: zString().min(1, 'Address is required')
});

router.get('/', async (req, res: Response, next: NextFunction) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

router
  .post(
    '/',
    zValidator({ body: addPersonSchema }),
    async (req: ReqWithValidated<typeof addPersonSchema>, res: Response, next: NextFunction) => {
      try {
        const newPerson = new Person(req.validated!.body);

        await newPerson.save();

        res.json({
          message: 'Person Added Successfully!'
        });
      } catch (err) {
        next(err);
      }
    }
  )
  .put(
    '/:id',
    zValidator({ body: addPersonSchema }),
    async (req: ReqWithValidated<typeof addPersonSchema>, res: Response, next: NextFunction) => {
      try {
        await Person.findOneAndUpdate({ _id: req.params.id }, req.validated!.body);

        res.json({
          message: 'Person updated successfully!'
        });
      } catch (err) {
        next(err);
      }
    }
  )
  .delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Person.deleteOne({ _id: req.params.id });

      res.json({
        message: 'Person deleted Successfully!'
      });
    } catch (err) {
      next(err);
    }
  });

export default router;
