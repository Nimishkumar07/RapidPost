import mongoose from "mongoose";

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m' // MongoDB TTL index randomly flushes expired tables natively 
    }
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
