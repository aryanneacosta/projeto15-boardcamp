import rentalsSchema from "../schemas/rentalsSchema.js";

async function validateRental(req, res, next) {
    const rental = req.body;
    const validation =  rentalsSchema.validate(rental);
    if (validation.error) {
        return res.sendStatus(400);
    }
    next();
}

export { validateRental };