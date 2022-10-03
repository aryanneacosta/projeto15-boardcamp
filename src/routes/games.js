import express from 'express';
import { allGames, addGames } from '../controllers/gamesController.js';

const gameRouter = express.Router();

gameRouter.get('/game', allGames);
gameRouter.post('/game', addGames);

export default gameRouter;