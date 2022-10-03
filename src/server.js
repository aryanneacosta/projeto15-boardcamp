import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRouter from './routes/categories.js';
import gameRouter from './routes/games.js';
import customersRouter from './routes/customers.js';
import rentalsRouter from './routes/rentals.js';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(categoryRouter);
server.use(gameRouter);
server.use(customersRouter);
server.use(rentalsRouter);

server.listen(process.env.PORT, () => {
    console.log(`The listening port is ${process.env.PORT}`);
});