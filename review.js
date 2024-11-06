const joi = require("joi")
const reviewServer = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required()
});



module.exports = reviewServer;

