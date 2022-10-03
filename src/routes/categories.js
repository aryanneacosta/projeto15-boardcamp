import express from 'express';
import { allCategories, addCategory } from '../controllers/categoriesController.js';

const categoryRouter = express.Router();

categoryRouter.get('/category', allCategories);
categoryRouter.post('/category', addCategory);

export default categoryRouter;