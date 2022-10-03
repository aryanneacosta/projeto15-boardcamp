import connection from '../databases/database.js';

async function allCustomers(req, res) {
    const { cpf } = req.query;

    try {
        if(cpf) {
            const customers = await connection.query('SELECT * FROM customers WHERE cpf = "$1%"', [cpf]);
            return res.send(customers.rows);
        }

        const customers = await connection.query('SELECT * FROM customers');
        res.send(customers.rows);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function customerById(req, res) {
    const { id } = req.params;

    try {
        const idExists = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);
        if(idExists.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.send(idExists.rows);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function addCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfAlreadyExists = await connection.query('SELECT cpf FROM customers WHERE cpf = $1', [cpf]);
        if(cpfAlreadyExists.rowCount !== 0) {
            return res.sendStatus(409);
        }
        
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfAlreadyExists = await connection.query('SELECT cpf FROM customers WHERE cpf = $1', [cpf]);
        if(cpfAlreadyExists.rowCount > 1) {
            return res.sendStatus(409);
        }

        await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [name, phone, cpf, birthday, id]);        
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export { allCustomers, customerById, addCustomer, updateCustomer };