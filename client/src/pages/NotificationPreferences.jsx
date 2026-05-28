import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/ui/Loader';
import { useToast } from '../context/ToastContext';

const NotificationPreferences = () => {
    const { subscription, subscribeToPush, unsubscribeFromPush } = useNotification();
    const [preferences, setPreferences] = useState({
        likes: true,
        comments: true,
        follows: true,
        newPosts: true
    });
    const [loading, setLoading] = useState(true);
    const [actionPending, setActionPending] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await api.get('/notifications/api/preferences');
                setPreferences(res.data.preferences);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load preferences", err);
                setLoading(false);
            }
        };
        fetchPreferences();
    }, []);

    const handleToggle = async (key) => {
        if (actionPending) return;
        setActionPending(true);
        const newPreferences = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPreferences);

        // Auto-save the preference
        try {
            await api.post('/notifications/api/preferences', { preferences: newPreferences });
            showToast("Preferences updated", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to update preferences", "error");
            // Revert on failure
            setPreferences(preferences);
        } finally {
            setActionPending(false);
        }
    };

    const handlePushToggle = async () => {
        if (actionPending) return;
        setActionPending(true);
        try {
            if (subscription) {
                await unsubscribeFromPush();
            } else {
                await subscribeToPush();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionPending(false);
        }
    };



    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );

    return (
        <div className="row">
            <div className="col-md-6 mx-auto py-4">
                <div className="card">
                    <div className="card-header">
                        <h4><i className="bi bi-gear"></i> Notification Preferences</h4>
                        <p className="text-muted mb-0">Choose which notifications you want to receive</p>
                    </div>
                    <div className="card-body">
                        <div>
                            {/* Likes */}
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="likesToggle"
                                        checked={preferences.likes}
                                        onChange={() => handleToggle('likes')}
                                        disabled={actionPending}
                                    />
                                    <label className="form-check-label" htmlFor="likesToggle">
                                        <strong>Like Notifications</strong>
                                        <br />
                                        <small className="text-muted">Get notified when someone likes your blog posts</small>
                                    </label>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="commentsToggle"
                                        checked={preferences.comments}
                                        onChange={() => handleToggle('comments')}
                                        disabled={actionPending}
                                    />
                                    <label className="form-check-label" htmlFor="commentsToggle">
                                        <strong>Comment Notifications</strong>
                                        <br />
                                        <small className="text-muted">Get notified when someone comments on your blog posts</small>
                                    </label>
                                </div>
                            </div>

                            {/* Follows */}
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="followsToggle"
                                        checked={preferences.follows}
                                        onChange={() => handleToggle('follows')}
                                        disabled={actionPending}
                                    />
                                    <label className="form-check-label" htmlFor="followsToggle">
                                        <strong>Follow Notifications</strong>
                                        <br />
                                        <small className="text-muted">Get notified when someone follows you</small>
                                    </label>
                                </div>
                            </div>

                            {/* New Posts */}
                            <div className="mb-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="newPostsToggle"
                                        checked={preferences.newPosts}
                                        onChange={() => handleToggle('newPosts')}
                                        disabled={actionPending}
                                    />
                                    <label className="form-check-label" htmlFor="newPostsToggle">
                                        <strong>New Post Notifications</strong>
                                        <br />
                                        <small className="text-muted">Get notified when people you follow publish new posts</small>
                                    </label>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="mb-4">
                                <h5><i className="bi bi-phone"></i> Push Notifications</h5>
                                <p className="text-muted small">Receive notifications on your device even when you're not using the website</p>

                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${subscription ? 'btn-outline-danger' : 'btn-success'}`}
                                        onClick={handlePushToggle}
                                        disabled={actionPending}
                                    >
                                        {actionPending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${subscription ? 'bi-bell-slash' : 'bi-bell-fill'} me-2`}></i>
                                                {subscription ? 'Disable Push Notifications' : 'Enable Push Notifications'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPreferences;
