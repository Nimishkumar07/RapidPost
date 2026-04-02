import User from "../models/user.js";
import Session from "../models/session.js";
import OTP from "../models/otp.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper.js";
import { sendOTP } from "../utils/mailer.js";
import { OAuth2Client } from "google-auth-library";
import { generateOTP, hashOTP } from "../utils/otpHelper.js";

// Requires GOOGLE_CLIENT_ID in .env
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

const createSession = async (user, rawRefreshToken, req) => {
    const session = new Session({
        user: user._id,
        refreshTokenHash: hashToken(rawRefreshToken),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
    });
    await session.save();
    user.activeSessions.push(session._id);
    await user.save();
}

export const SignUp = async (req, res) => {
    try {
        let { name, username, email, password } = req.body
        const existingUser = await User.findOne({ email });
        
        if (existingUser && existingUser.isVerified) {
             return res.status(400).json({ error: "User already exists with this email." });
        }

        const otpCode = generateOTP();
        
        if (existingUser) {
             // Wipe the entire ghost document
             await User.findByIdAndDelete(existingUser._id);
             // Wipe old OTPs if they exist
             await OTP.deleteMany({ email });
        }

        const newUser = new User({ name, email, username, password, isVerified: false });
        // pre-save hook will automatically hash the password utilizing bcrypt!
        await newUser.save(); 
        
        // Isolate OTP into a generic standalone model with TTL drop mechanism
        const newOTP = new OTP({ email, otp: hashOTP(otpCode) });
        await newOTP.save();

        await sendOTP(email, otpCode);

        res.status(201).json({ message: "OTP sent to email. Please verify." });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

export const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const existingOTP = await OTP.findOne({ email });
        if (!existingOTP) {
             return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Redundant generic timestamp check in case TTL thread delays
        const diffInMinutes = (new Date() - new Date(existingOTP.createdAt)) / 60000;
        if (diffInMinutes > 10) {
             await OTP.findByIdAndDelete(existingOTP._id);
             return res.status(400).json({ error: "OTP has expired" });
        }

        const isMatch = hashOTP(otp) === existingOTP.otp;
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid OTP" });
        }
        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.isVerified) return res.status(400).json({ error: "User is already verified" });
        
        // Execute OTP logic
        user.isVerified = true;
        await user.save();
        
        // Delete OTP document automatically to stop retry attacks
        await OTP.findByIdAndDelete(existingOTP._id);
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await createSession(user, refreshToken, req);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
        res.json({ message: "Verification successful", user, accessToken });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Extract raw fields via Bcrypt methodology
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
             return res.status(401).json({ message: "Please verify your email first." });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await createSession(user, refreshToken, req);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
        res.json({ message: "Welcome back", user, accessToken });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await googleClient.verifyIdToken({
             idToken: credential,
             audience: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id'
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;
        
        let user = await User.findOne({ email });

        if (!user) {
             const baseUsername = email.split('@')[0];
             let username = baseUsername;
             let userExists = await User.findOne({ username });
             while(userExists) {
                  username = baseUsername + Math.floor(Math.random() * 10000);
                  userExists = await User.findOne({ username });
             }

             // We don't inject a password here because Google is the provider. 
             user = new User({
                  email, name, username, 
                  googleId: sub, isVerified: true,
                  avatar: { url: picture, filename: 'google' }
             });
             await user.save();
        } else if (!user.googleId) {
             user.googleId = sub;
             user.isVerified = true;
             await user.save();
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await createSession(user, refreshToken, req);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
        res.json({ message: "Google Login successful", user, accessToken });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export const refreshToken = async (req, res) => {
     try {
         const token = req.cookies.refreshToken;
         if (!token) return res.status(401).json({ message: "No refresh token provided" });

         const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_for_dev');
         const user = await User.findById(decoded._id);
         if (!user) return res.status(401).json({ message: "User not found" });

         // verify session
         const tokenHash = hashToken(token);
         const session = await Session.findOne({ user: user._id, refreshTokenHash: tokenHash });

         if (!session || session.revoked) {
              return res.status(401).json({ message: "Session invalid or revoked" });
         }

         // rotate token
         // Cleanup old session to stop db leaking
         await Session.findByIdAndDelete(session._id);
         user.activeSessions.pull(session._id);
         await user.save();

         const newRefreshToken = generateRefreshToken(user);
         await createSession(user, newRefreshToken, req);
         res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });

         const newAccessToken = generateAccessToken(user);
         res.json({ accessToken: newAccessToken });
     } catch (e) {
         res.status(401).json({ message: "Invalid or expired refresh token" });
     }
}

export const logOut = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const tokenHash = hashToken(token);
            await Session.findOneAndUpdate({ refreshTokenHash: tokenHash }, { revoked: true });
        }
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
        res.json({ message: "You are logged out" });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) return res.json({ user: null });
        const user = await User.findById(req.user._id);
        res.json({ user: user });
    } catch(e) {
        res.json({ user: null });
    }
}