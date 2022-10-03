import express from 'express';
import { allRentals, addRental, finishedRental, deleteRental } from '../controllers/rentalsController.js';
import { validateRental } from '../middlewares/rentalsMiddleware.js'

const rentalsRouter = express.Router();

rentalsRouter.get('/rentals', allRentals);
rentalsRouter.post('/rentals', validateRental, addRental);
rentalsRouter.post('/rentals/:id/return', finishedRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;