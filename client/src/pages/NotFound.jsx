import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 bg-white text-center px-3" style={{ minHeight: '70vh' }}>
            <Helmet>
                <title>Page Not Found | RapidPost</title>
                <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>
            
            <div className="mb-4 text-primary" style={{ fontSize: '6rem', lineHeight: 1 }}>
                <i className="bi bi-search"></i>
            </div>
            
            <h1 className="fw-bold mb-3 display-4 text-dark">404</h1>
            <h2 className="h3 fw-semibold mb-3">Page Not Found</h2>
            
            <p className="text-muted mb-5 lead mx-auto" style={{ maxWidth: '32rem' }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                <i className="bi bi-house-door-fill me-2"></i> Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
