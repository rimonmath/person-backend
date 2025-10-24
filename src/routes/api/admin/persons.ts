import express, { NextFunction, type Request, type Response } from 'express';
import { ReqWithValidated, zValidator } from '../../../middlewares/zValidator.js';
import { object as zObject, string as zString, email as zEmail, enum as zEnum } from 'zod';
import { Person } from '../../../db/models/Person.js';
import { uploadSingle } from '../../../middlewares/fileUpload.js';
import fs from 'node:fs';
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

        const result = await newPerson.save();

        res.json({
          message: 'Person Added Successfully!',
          result
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
  .put('/:id/change-image', async (req, res: Response, next: NextFunction) => {
    uploadSingle.any()(req, res, async (err: any) => {
      try {
        console.log('11111111111111111');
        if (err) {
          next(err);
          return;
        }

        if (!req.files?.length) {
          console.log('111111111222222222');

          return res.status(400).json({ message: 'No files uploaded' });
        }

        for (const file of req.files) {
          if (file.fieldname === 'image') {
            const updateData = { image: file.path };

            const result = await Person.findOneAndUpdate({ _id: req.params.id }, updateData, {
              new: true
            });

            // const status = await db.projects.update(updateData, {
            //   where: {
            //     id: req.params.id,
            //     userId: req.tokenData.data.id
            //   }
            // });

            return res.json({
              message: 'Image updated successfully!',
              result
            });
          }

          console.log('22222222222222222');
        }

        console.log('333333333333333');

        res.status(400).json({ message: 'Image file not found in upload' });
      } catch (e) {
        console.log('Unexpected EEEEE', e);
        if (req.files?.length) {
          for (const file of req.files) {
            fs.unlink(file.path, (err) => {
              if (err) console.error(`Error deleting file: ${err}`);
              else console.log(`${file.path} has been deleted`);
            });
          }
        }

        next(e);
      }
    });
  })
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
