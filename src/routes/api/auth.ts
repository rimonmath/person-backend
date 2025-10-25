import express, { NextFunction, Request, Response } from 'express';
import { User } from '../../db/models/User.js';
import { hashPassword, verifyPassword } from '../../utils/functions.js';
import { ReqWithValidated, zValidator } from '../../middlewares/zValidator.js';
import { object as zObject, string as zString, email as zEmail } from 'zod';
import jwt from 'jsonwebtoken';

const router = express.Router();

const signinSchema = zObject({
  email: zEmail().min(3).max(100).nonempty(),
  password: zString().min(6).nonempty()
});

router.post(
  '/signin',
  zValidator({ body: signinSchema }),
  async (req: ReqWithValidated<typeof signinSchema>, res: Response, next: NextFunction) => {
    try {
      // const adminUser = {
      //   full_name: 'Mamunur Rashid',
      //   email: 'rimonmath@gmail.com', // duplicate triggers error
      //   userType: 'Admin',
      //   password: await hashPassword('111111')
      // };
      // const newUser = new User(adminUser);
      // await newUser.save();

      const { email, password } = req.validated!.body;

      console.log({ email });

      // Find user by email
      const user = await User.findOne({ email });

      console.log(user);

      if (!user) {
        return res.status(401).json({ message: 'User not registered!' });
      }

      // Compare password
      const hashedInputPassword = await hashPassword(password);

      const isCorrectPassword = await verifyPassword(user.password, password);

      if (!isCorrectPassword) {
        return res.status(401).json({ message: 'Invalid login credentials!' });
      }

      const now = Math.floor(Date.now() / 1000);

      const accessTokenPayload = {
        userId: user._id,
        userType: user.user_type,
        exp: now + 60 * 60 * 1000 * 24 * 30 // 30 days
      };

      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.JWT_PRIVATE_KEY || 'fallback-secret' // use a proper env variable
      );

      res.json({
        message: 'Logged in successfully!',
        accessToken,
        redirect: '/dashboard/persons'
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

/* Initial User creation
  const adminUser = {
    full_name: 'Mamunur Rashid',
    email: 'rimonmath@gmail.comm', // duplicate triggers error
    userType: 'Admin',
    password: await hashPassword('111111')
  };
  const newUser = new User(adminUser);
  await newUser.save();
  */
