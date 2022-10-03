import connection from "../databases/database.js";

async function allGames(req, res) {
    const { name } = req.query;

    try {
        if(name) {
            const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE "$1%"', [name]);
            return res.send(games.rows);
        }

        const games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id');
        res.send(games.rows);
    } catch (error) {
        res.sendStatus(500);
    }
};

async function addGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    if(!name || stockTotal <= 0 || pricePerDay <= 0) {
        return res.sendStatus(400);
    }

    try {
        const categoryExists = await connection.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
        if(categoryExists.rowCount === 0) {
            return res.sendStatus(400);
        }
        const gameAlreadyExists = await connection.query('SELECT name FROM games WHERE name = $1', [name]);
        if(gameAlreadyExists.rowCount > 0) {
            return res.sendStatus(409);
        }

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
        console.log(error.message)
    }
};

export { allGames, addGames };