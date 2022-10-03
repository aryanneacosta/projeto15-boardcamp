import express from 'express';
import { allCustomers, customerById, addCustomer, updateCustomer } from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/customersMiddleware.js';

const customersRouter = express.Router();

customersRouter.get('/customers', allCustomers);
customersRouter.get('/customers/:id', customerById);
customersRouter.post('/customers', validateCustomers, addCustomer);
customersRouter.put('/customers/:id', validateCustomers, updateCustomer);

export default customersRouter;