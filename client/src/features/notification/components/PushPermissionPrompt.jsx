import { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

const PushPermissionPrompt = () => {
    const { showPushPrompt, subscribeToPush, dismissPrompt } = useNotification();
    const [loading, setLoading] = useState(false);

    if (!showPushPrompt) return null;

    const handleEnable = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
                await subscribeToPush();
            } else {
                dismissPrompt();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        if (loading) return;
        setLoading(true);
        dismissPrompt();
        setLoading(false);
    };

    return (
        <div className="alert alert-info alert-dismissible fade show position-fixed"
            style={{ top: '80px', right: '20px', zIndex: 1050, maxWidth: '350px' }}>
            <button type="button" className="btn-close" onClick={handleDismiss} disabled={loading} aria-label="Close"></button>
            <strong>📱 Stay Updated!</strong><br />
            Enable push notifications to get alerts even when you're not on the site.
            <div className="mt-2">
                <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={handleEnable}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Enable Notifications'}
                </button>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleDismiss}
                    disabled={loading}
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default PushPermissionPrompt;
