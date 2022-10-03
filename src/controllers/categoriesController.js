import connection from '../databases/database.js';

async function allCategories(req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories');
        res.send(categories.rows);
    } catch (error) {
        return res.sendStatus(500);
    }
}

async function addCategory(req, res) {
    const { name } = req.body;
    if (!name) {
        return res.sendStatus(400);
    }

    try {
        const categoryAlreadyExists = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        if(categoryAlreadyExists.rowCount > 0) {
            return res.sendStatus(409);
        }
        await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
}

export { allCategories, addCategory };