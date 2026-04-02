import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refreshTokenHash: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        default: 'Unknown IP'
    },
    userAgent: {
        type: String,
        default: 'Unknown Browser'
    },
    revoked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
