export const optimizeCloudinaryUrl = (url, width) => {
    if (!url) return url;
    if (!url.includes('cloudinary.com')) return url;
    // Don't apply transformations if they already exist
    if (url.includes('/upload/q_') || url.includes('/upload/f_') || url.includes('/upload/w_')) {
        return url;
    }

    const transform = `q_auto,f_auto${width ? `,w_${width}` : ''}`;
    return url.replace('/upload/', `/upload/${transform}/`);
};
