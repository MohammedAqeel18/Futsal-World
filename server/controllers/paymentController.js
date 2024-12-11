const stripe = require('stripe')('sk_test_51PPc3URrD4b010W800jFpYrGAjkdXurldHbVEs6kC6tAe4ascPwtwzjiXBhAo210X47DfIpVh75mqE7MXrIjGXH300hLF68cfz');

exports.makePayment = (req, res) => {
    const { amount, source, currency } = req.body;

    stripe.charges.create({
        amount,
        source,
        currency,
    })
    .then(charge => res.json(charge))
    .catch(err => res.status(500).json({ message: 'Payment error', error: err }));
};
