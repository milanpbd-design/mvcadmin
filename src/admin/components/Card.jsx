export default function Card({ children, className = '', padding = 'p-6', hover = false, onClick }) {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700';
    const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '';
    const clickClasses = onClick ? 'cursor-pointer' : '';

    return (
        <div
            className={`${baseClasses} ${padding} ${hoverClasses} ${clickClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action }) {
    return (
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
            {children}
        </div>
    );
}
