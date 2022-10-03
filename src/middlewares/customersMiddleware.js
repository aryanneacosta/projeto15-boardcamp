import customersSchema from "../schemas/customersSchema.js";

async function validateCustomers(req, res, next) {
    const customer = req.body;
    const validation = customersSchema.validate(customer);
    if (validation.error) {
        return res.sendStatus(400);
    }
    next();
}

export { validateCustomers };