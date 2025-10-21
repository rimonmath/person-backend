import express from 'express';
import { adminAuthMiddlewere } from '../../../middlewares/adminAuth.js';
import personsRoute from './persons.js';
import usersRoute from './users.js';
const router = express.Router();

// Apply admin authentication middleware
router.use(adminAuthMiddlewere);

// Nested routes
router.use('/persons', personsRoute);
router.use('/users', usersRoute);

export default router;
