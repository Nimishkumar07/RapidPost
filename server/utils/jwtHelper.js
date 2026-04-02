import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret_for_dev',
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_for_dev',
        { expiresIn: '7d' }
    );
};
