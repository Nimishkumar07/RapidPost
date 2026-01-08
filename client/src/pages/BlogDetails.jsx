import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../features/blog/services/blogService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { useBlogDetails } from '../features/blog/hooks/useBlogDetails';
import BlogComments from '../features/blog/components/BlogComments';
import BlogHeader from '../features/blog/components/BlogHeader';
import BlogContent from '../features/blog/components/BlogContent';

const BlogDetails = () => {
    const { id } = useParams();
    const { user, setUser } = useAuth();
    const { blog, setBlog, loading, error } = useBlogDetails(id);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);


    // Ensure voices are loaded (Mobile fix)
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleReadAloud = () => {
        if (!blog || !blog.description) return;

        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            return;
        }

        const text = new DOMParser().parseFromString(blog.description, 'text/html').body.textContent;
        if (!text.trim()) return;

        // Mobile browsers sometimes need a kickstart
        window.speechSynthesis.cancel();

        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);

        // Improve voice selection for mobile
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Prefer English
            const preferredVoice = voices.find(v => v.lang.includes('en')) || voices[0];
            utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsReading(false);
        utterance.onerror = (e) => {
            console.error("Speech error", e);
            setIsReading(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error("Failed to copy: ", err));
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like");
        try {
            await blogService.toggleLike(id);
            setBlog(prev => {
                const userId = user._id;
                const likes = prev.likes || [];
                const isLiked = likes.includes(userId);
                let newLikes;
                if (isLiked) {
                    newLikes = likes.filter(uid => uid !== userId);
                } else {
                    newLikes = [...likes, userId];
                }
                return { ...prev, likes: newLikes };
            });
        } catch (err) {
            console.error("Like error", err);
        }
    };

    const handleSave = async () => {
        if (!user) return alert("Please login to save");
        try {
            await blogService.toggleSave(id);
            const isSaved = user.savedBlogs?.includes(id);
            let newSavedBlogs;
            if (isSaved) {
                newSavedBlogs = user.savedBlogs.filter(bid => bid !== id);
            } else {
                newSavedBlogs = [...(user.savedBlogs || []), id];
            }
            setUser({ ...user, savedBlogs: newSavedBlogs });
        } catch (err) {
            console.error("Save error", err);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!blog) return <div className="text-center mt-5">Blog not found</div>;

    return (
        <div className="position-relative">
            <div className="container py-4" style={{ maxWidth: '64rem' }}>
                <BlogHeader
                    blog={blog}
                    handleReadAloud={handleReadAloud}
                    isReading={isReading}
                />

                <BlogContent
                    blog={blog}
                    user={user}
                    handleLike={handleLike}
                    handleShare={handleShare}
                    handleSave={handleSave}
                />

                {/* Comments Section */}
                <BlogComments blog={blog} setBlog={setBlog} user={user} />
            </div>
        </div>
    );
};

export default BlogDetails;
