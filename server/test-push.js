import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/user.js';
import webpush from 'web-push';

async function test() {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.ATLASDB_URL);

    // Find a user with push subscriptions
    const user = await User.findOne({ pushSubscriptions: { $exists: true, $not: { $size: 0 } } });
    if (!user) {
        console.log("No users with sub found.");
        process.exit(0);
    }

    console.log("Found user:", user.email, "Subs:", user.pushSubscriptions.length);

    webpush.setVapidDetails(
        'mailto:test@example.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );

    const payload = JSON.stringify({
        title: 'Test Notification',
        body: 'Debug push',
        icon: '/favicon.ico',
    });

    for (let sub of user.pushSubscriptions) {
        try {
            // Using .toObject() or normal
            let plainSub = sub.toObject ? sub.toObject() : sub;
            console.log("Sending to:", plainSub.endpoint);
            const res = await webpush.sendNotification(plainSub, payload);
            console.log("Success:", res.statusCode);
        } catch (err) {
            console.error("Push Error:", err);
        }
    }

    process.exit(0);
}
test();
