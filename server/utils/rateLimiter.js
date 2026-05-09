import rateLimit from 'express-rate-limit';


export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many authentication attempts, please try again after 15 minutes",
});

export const creationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hr
    max: 20, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many items created from this IP, please try again after an hour",
});
