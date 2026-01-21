import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    // Remove 'admin' from breadcrumbs if present
    const filteredPathnames = pathnames.filter(p => p !== 'admin');

    const breadcrumbNameMap = {
        'editor': 'Articles',
        'categories': 'Categories',
        'users': 'Experts',
        'homepage': 'Homepage',
        'research': 'Research',
        'category-heroes': 'Category Images',
        'media': 'Media Library',
        'theme': 'Settings',
        'settings': 'Settings',
    };

    if (filteredPathnames.length === 0) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Dashboard</span>
            </div>
        );
    }

    return (
        <nav className="flex items-center gap-2 text-sm">
            <Link
                to="/admin"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
            </Link>

            {filteredPathnames.map((name, index) => {
                const routeTo = `/admin/${filteredPathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === filteredPathnames.length - 1;
                const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <div key={name} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {isLast ? (
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{displayName}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                {displayName}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
