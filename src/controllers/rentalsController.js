import connection from "../databases/database.js";

async function allRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        if(customerId) {
            const rentals = await connection.query('SELECT * FROM rentals WHERE "customerId" = $1', [customerId]);
            return res.send(rentals.rows);
        }
        if(gameId) {
            const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);
            return res.send(rentals.rows);
        }

        const rentals = await connection.query('SELECT * FROM rentals');
        res.send(rentals.rows);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function addRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customerExists = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);
        if(customerExists.rowCount === 0) {
            return res.sendStatus(400);
        }
        const gameExists = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);
        if(gameExists.rowCount === 0) {
            return res.sendStatus(400);
        }
        const game = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);
        const gameData = game.rows;
        if(gameExists.rowCount > 0) {
            if (gameData.stockTotal === gameExists.rowCount){
                return res.sendStatus(400);
            }
        }

        const originalPrice = gameExists.rows[0].pricePerDay * daysRented;

        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, NULL, $4, NULL)', [customerId, gameId, daysRented, originalPrice])
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function finishedRental(req, res) {
    const { id } = req.params;

    try {
        const rentalExists = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if(rentalExists.rowCount === 0) {
            return res.sendStatus(404);
        }
        if(rentalExists.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        }

        const rentData = rentalExists.rows[0];
        const difference = new Date() - new Date(rentData.rentDate);
        let delayFee = 0;
        if(difference > rentData.daysRented) {
            delayFee = (difference - rentData.daysRented) * rentData.originalPrice;
        }

        await connection.query('UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2', [delayFee, id]);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error.message)
    }
}

async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rentalExists = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if(rentalExists.rowCount === 0) {
            return res.sendStatus(404);
        }
        if(rentalExists.rows[0].returnDate === null) {
            return res.sendStatus(400);
        }

        await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export { allRentals, addRental, finishedRental, deleteRental };