import webpush from 'web-push';
import User from '../models/user.js';

class PushNotificationService {
    constructor() {
        // Set VAPID keys (generated for your app)
        const vapidKeys = {
            publicKey: process.env.VAPID_PUBLIC_KEY || 'BPKkY4d1Wk1gy_9JJNA770cepLbSkD67As80FiXBIK0haVyhcjKJoDacetccump63pT6az7iBK46oIr_x_vswBk',
            privateKey: process.env.VAPID_PRIVATE_KEY || 'ffJqe0NO2wY3MzeMDvpuv6w1IO5dgOjx81OB6cSUJYw'
        };

        webpush.setVapidDetails(
            'mailto:rapidpost@example.com', // Replace with your actual email
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );

        this.publicKey = vapidKeys.publicKey;
    }

    // Get VAPID public key for client-side subscription
    getPublicKey() {
        return this.publicKey;
    }

    // Save push subscription for a user
    async savePushSubscription(userId, subscription) {
        try {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { pushSubscriptions: subscription }
            });
            console.log('Push subscription saved for user:', userId);
        } catch (error) {
            console.error('Error saving push subscription:', error);
            throw error;
        }
    }

    // Remove push subscription for a user
    async removePushSubscription(userId, endpoint) {
        try {
            await User.findByIdAndUpdate(userId, {
                $pull: { pushSubscriptions: { endpoint: endpoint } }
            });
            console.log('Push subscription removed for user:', userId);
        } catch (error) {
            console.error('Error removing push subscription:', error);
            throw error;
        }
    }

    // Send push notification to a user
    async sendPushNotification(userId, notification) {
        try {
            const user = await User.findById(userId);
            
            if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
                console.log('No push subscriptions found for user:', userId);
                return;
            }

            const payload = JSON.stringify({
                title: this.getNotificationTitle(notification.type),
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                data: {
                    notificationId: notification._id,
                    type: notification.type,
                    relatedBlog: notification.relatedBlog,
                    url: this.getNotificationUrl(notification)
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View',
                        icon: '/favicon.ico'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            });

            // Send to all user's subscriptions
            const pushPromises = user.pushSubscriptions.map(async (subscription) => {
                try {
                    await webpush.sendNotification(subscription, payload);
                    console.log('Push notification sent successfully');
                } catch (error) {
                    console.error('Error sending push notification:', error);
                    
                    // If subscription is invalid, remove it
                    if (error.statusCode === 410 || error.statusCode === 404) {
                        await this.removePushSubscription(userId, subscription.endpoint);
                    }
                }
            });

            await Promise.all(pushPromises);
        } catch (error) {
            console.error('Error in sendPushNotification:', error);
        }
    }

    // Get notification title based on type
    getNotificationTitle(type) {
        const titles = {
            'like': '❤️ New Like',
            'comment': '💬 New Comment',
            'follow': '👥 New Follower',
            'new_post': '📝 New Post'
        };
        return titles[type] || '🔔 New Notification';
    }

    // Get notification URL based on type
    getNotificationUrl(notification) {
        if (notification.relatedBlog) {
            return `/blogs/${notification.relatedBlog}`;
        }
        return '/notifications';
    }

    // Test push notification
    async sendTestNotification(userId) {
        const testNotification = {
            _id: 'test',
            type: 'like',
            message: 'This is a test push notification!',
            relatedBlog: null
        };

        await this.sendPushNotification(userId, testNotification);
    }
}

export default new PushNotificationService();