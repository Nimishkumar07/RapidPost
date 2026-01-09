import { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { useAuth } from '../../../context/AuthContext';

export const useBlogDetails = (id) => {
    const { socket } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const response = await blogService.getById(id);
                const blogData = response.data.blog || response.data;

                setBlog(blogData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setError('Failed to fetch blog details');
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    useEffect(() => {
        if (socket && id) {
            socket.emit('join_blog', id);

            const handleNewComment = (newComment) => {
                setBlog(prev => {
                    if (!prev) return prev;
                    if (prev.reviews.some(r => r._id === newComment._id)) return prev;
                    return { ...prev, reviews: [...prev.reviews, newComment] };
                });
            };

            const handleDeleteComment = (reviewId) => {
                setBlog(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        reviews: prev.reviews.filter(r => r._id !== reviewId)
                    };
                });
            };

            socket.on('newComment', handleNewComment);
            socket.on('deleteComment', handleDeleteComment);

            return () => {
                socket.emit('leave_blog', id);
                socket.off('newComment', handleNewComment);
                socket.off('deleteComment', handleDeleteComment);
            };
        }
    }, [socket, id]);

    return { blog, setBlog, loading, error };
};
