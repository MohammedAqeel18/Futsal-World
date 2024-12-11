const Review = require('../models/Review');

exports.createReview = (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const newReview = new Review({
        user: userId,
        rating,
        comment
    });

    newReview.save()
        .then(review => res.json(review))
        .catch(err => res.status(500).json({ message: 'Error creating review', error: err }));
};

exports.getReviews = (req, res) => {
    Review.find()
        .then(reviews => res.json(reviews))
        .catch(err => res.status(500).json({ message: 'Error fetching reviews', error: err }));
};
