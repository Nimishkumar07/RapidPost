import Joi from 'joi'

export const blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().custom((value, helpers) => {
            const plainText = value.replace(/<[^>]*>?/gm, '');
            const wordCount = plainText.trim().split(/\\s+/).filter(word => word.length > 0).length;
            if (wordCount < 300) {
                return helpers.message('Description must be at least 300 words long');
            }
            return value;
        }).required(),
        category: Joi.string().required(),
        image: Joi.string().allow("",null),
    }).required(),
})

export const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required()
    }).required()
})